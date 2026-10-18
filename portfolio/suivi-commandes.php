<?php
declare(strict_types=1);

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Content-Type: text/html; charset=utf-8');

if (!in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1', '::ffff:127.0.0.1'], true)) {
    http_response_code(403);
    exit('Accès local uniquement.');
}

function escape_value($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$orders = [];
$path = __DIR__ . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'demandes.php';
if (is_file($path)) {
    $file = fopen($path, 'rb');
    if ($file !== false) {
        fgets($file);
        while (($line = fgets($file)) !== false) {
            $order = json_decode($line, true);
            if (!is_array($order) || !isset($order['reference'])) continue;
            $orders[] = $order;
            if (count($orders) > 100) array_shift($orders);
        }
        fclose($file);
    }
}
$orders = array_reverse($orders);
?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Commandes reçues — Marwane El Badaoui</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    body { min-height: 100svh; }
    .orders-admin { width: min(980px, calc(100% - 40px)); margin: 0 auto; padding: 60px 0 100px; }
    .orders-admin__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 25px; margin-bottom: 35px; }
    .orders-admin h1 { margin-top: 7px; font-size: clamp(32px, 5vw, 48px); line-height: 1.2; }
    .orders-admin__intro { margin-top: 12px; color: var(--text-soft); }
    .orders-admin__count { display: inline-block; margin-bottom: 18px; padding: 7px 12px; border-radius: 99px; background: var(--accent-soft); color: var(--accent-strong); font-size: 12px; }
    .admin-order { padding: 28px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); }
    .admin-order + .admin-order { margin-top: 17px; }
    .admin-order__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; }
    .admin-order h2 { font-size: 21px; }
    .admin-order time { color: var(--text-faint); font-size: 12px; white-space: nowrap; }
    .admin-order__ref { color: var(--accent); font-size: 11px; font-weight: 700; letter-spacing: .08em; }
    .admin-order__details { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 17px; }
    .admin-order__details span { padding: 5px 10px; border: 1px solid #76608b; border-radius: 7px; background: var(--accent-soft); color: var(--accent-strong); font-size: 12px; }
    .admin-order__description { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--text-soft); white-space: pre-wrap; overflow-wrap: anywhere; }
    .admin-order__email { display: inline-block; margin-top: 19px; color: var(--accent-strong); font-size: 13px; overflow-wrap: anywhere; }
    .orders-empty { padding: 44px; border: 1px dashed var(--line); border-radius: 16px; color: var(--text-soft); text-align: center; }
    @media (max-width: 650px) { .orders-admin__header, .admin-order__top { flex-direction: column; } .orders-admin__header .button { width: 100%; } .admin-order { padding: 22px; } }
  </style>
</head>
<body>
  <main class="orders-admin">
    <div class="orders-admin__header">
      <div><p class="eyebrow">Espace local</p><h1>Commandes reçues</h1><p class="orders-admin__intro">Les 100 commandes les plus récentes envoyées depuis le portfolio.</p></div>
      <a class="button button--secondary" href="index.html#commandes">Voir le panier</a>
    </div>
    <span class="orders-admin__count"><?= count($orders) ?> commande<?= count($orders) > 1 ? 's' : '' ?> affichée<?= count($orders) > 1 ? 's' : '' ?></span>
    <?php if (!$orders): ?>
      <p class="orders-empty">Aucune commande reçue pour le moment.</p>
    <?php else: foreach ($orders as $order): ?>
      <?php
        $date = '';
        $displayServices = isset($order['services']) && is_array($order['services']) ? $order['services'] : [$order['service'] ?? ''];
        if (!empty($order['created_at'])) {
            try {
                $date = (new DateTimeImmutable((string) $order['created_at']))->setTimezone(new DateTimeZone('Africa/Casablanca'))->format('d/m/Y à H:i');
            } catch (Exception $exception) {
                $date = '';
            }
        }
      ?>
      <article class="admin-order">
        <div class="admin-order__top"><div><span class="admin-order__ref"><?= escape_value($order['reference'] ?? '') ?></span><h2><?= escape_value($order['name'] ?? '') ?></h2></div><?php if ($date): ?><time><?= escape_value($date) ?></time><?php endif; ?></div>
        <div class="admin-order__details"><?php foreach ($displayServices as $service): ?><span><?= escape_value($service) ?></span><?php endforeach; ?><?php if (!empty($order['budget'])): ?><span>Budget : <?= escape_value($order['budget']) ?></span><?php endif; ?></div>
        <p class="admin-order__description"><?= escape_value($order['description'] ?? '') ?></p>
        <a class="admin-order__email" href="mailto:<?= escape_value($order['email'] ?? '') ?>">Répondre à <?= escape_value($order['email'] ?? '') ?> ↗</a>
      </article>
    <?php endforeach; endif; ?>
  </main>
</body>
</html>
