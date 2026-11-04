<?php
declare(strict_types=1);

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(int $status, string $message, ?string $reference = null): void
{
    global $wantsJson;
    http_response_code($status);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'ok' => $status < 400,
            'message' => $message,
            'reference' => $reference,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    header('Content-Type: text/html; charset=utf-8');
    $title = $status < 400 ? 'Commande enregistrée' : 'Commande non enregistrée';
    $safeTitle = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeReference = htmlspecialchars($reference ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    echo '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' . $safeTitle . ' — Marwane El Badaoui</title><link rel="stylesheet" href="styles.css"><style>body{min-height:100svh;display:grid;place-items:center;padding:24px}.response-card{width:min(560px,100%);padding:40px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.response-card h1{font-size:clamp(28px,5vw,40px)}.response-card p{margin:18px 0 25px;color:var(--text-soft)}.response-card strong{color:var(--accent-strong)}</style></head><body><main class="response-card"><h1>' . $safeTitle . '</h1><p>' . $safeMessage . '</p>';
    if ($reference !== null) {
        echo '<p>Référence : <strong>' . $safeReference . '</strong></p>';
    }
    echo '<a class="button" href="index.html#commandes">Retour au portfolio</a></main></body></html>';
    exit;
}

function post_field(string $name): string
{
    $value = $_POST[$name] ?? '';
    return is_string($value) ? trim($value) : '';
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'Utilisez le panier du portfolio pour passer commande.');
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 12000) {
    respond(413, 'Votre commande est trop longue.');
}

if (post_field('website') !== '') {
    respond(422, 'La commande n’a pas pu être validée.');
}

$name = post_field('name');
$email = post_field('email');
$selectedServices = $_POST['services'] ?? null;
if ($selectedServices === null && post_field('service') !== '') {
    $selectedServices = [post_field('service')];
}
$budget = post_field('budget');
$description = str_replace("\r\n", "\n", post_field('description'));
$consent = post_field('consent');
$services = [
    'site-web' => 'Site vitrine',
    'application-web' => 'Application web',
    'reseau-systemes' => 'Réseaux & systèmes',
    'autre' => 'Autre projet',
];

if (text_length($name) < 2 || text_length($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    respond(422, 'Vérifiez votre nom et votre adresse e-mail.');
}
if (!is_array($selectedServices) || count($selectedServices) < 1 || count($selectedServices) > count($services)) {
    respond(422, 'Ajoutez au moins un service au panier.');
}
$serviceLabels = [];
foreach ($selectedServices as $key) {
    if (!is_string($key) || !array_key_exists($key, $services) || in_array($services[$key], $serviceLabels, true)) {
        respond(422, 'Le panier contient un service invalide.');
    }
    $serviceLabels[] = $services[$key];
}
if (text_length($budget) > 80 || text_length($description) < 20 || text_length($description) > 3000) {
    respond(422, 'Vérifiez le budget et la description du projet (20 caractères minimum).');
}
if ($consent !== 'yes') {
    respond(422, 'Votre accord est nécessaire pour enregistrer et traiter la commande.');
}

$reference = 'CMD-' . strtoupper(bin2hex(random_bytes(4)));
$record = [
    'reference' => $reference,
    'created_at' => gmdate('c'),
    'name' => $name,
    'email' => $email,
    'service' => $serviceLabels[0],
    'services' => $serviceLabels,
    'budget' => $budget,
    'description' => $description,
];
$line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
if ($line === false) {
    respond(500, 'Impossible d’enregistrer la commande pour le moment.');
}

$directory = __DIR__ . DIRECTORY_SEPARATOR . 'data';
$path = $directory . DIRECTORY_SEPARATOR . 'demandes.php';
$header = "<?php exit; ?>\n";
if (!is_dir($directory) && !@mkdir($directory, 0700, true)) {
    respond(500, 'Impossible d’enregistrer la commande pour le moment.');
}
$file = @fopen($path, 'c+');
if ($file === false || !flock($file, LOCK_EX)) {
    if ($file !== false) fclose($file);
    respond(500, 'Impossible d’enregistrer la commande pour le moment.');
}

$stat = fstat($file);
$validFile = $stat !== false;
if ($validFile && $stat['size'] === 0) {
    $validFile = fwrite($file, $header) === strlen($header);
} elseif ($validFile) {
    rewind($file);
    $validFile = fread($file, strlen($header)) === $header;
}

if ($validFile) {
    fseek($file, 0, SEEK_END);
    $start = ftell($file);
    $payload = $line . "\n";
    $offset = 0;
    while ($offset < strlen($payload)) {
        $written = fwrite($file, substr($payload, $offset));
        if ($written === false || $written === 0) {
            $validFile = false;
            break;
        }
        $offset += $written;
    }
    if (!$validFile && $start !== false) ftruncate($file, $start);
    if ($validFile) $validFile = fflush($file);
}

flock($file, LOCK_UN);
fclose($file);
if (!$validFile) {
    respond(500, 'Impossible d’enregistrer la commande pour le moment.');
}

respond(200, 'Votre commande a bien été enregistrée. Je vous répondrai par e-mail pour préciser le devis.', $reference);
