<?php
/**
 * Plugin Name: EugineStore WhatsApp Bot Bridge
 * Plugin URI: https://euginemediagroup.com
 * Description: Jembatan Notifikasi WhatsApp otomatis dari WooCommerce ke service EugineBill-wa (Port 3002).
 * Version: 1.0.0
 * Author: Eugine Media Group
 * Author URI: https://euginemediagroup.com
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Notifikasi Saat Pesanan Baru Masuk (Pending Payment)
add_action('woocommerce_new_order', 'euginestore_send_wa_new_order', 10, 2);
function euginestore_send_wa_new_order($order_id, $order = null) {
    if (!$order) {
        $order = wc_get_order($order_id);
    }
    if (!$order) return;

    $phone = $order->get_billing_phone();
    if (empty($phone)) return;

    $name = $order->get_billing_first_name();
    $total = number_format($order->get_total(), 0, ',', '.');
    $order_num = $order->get_order_number();
    $pay_method = $order->get_payment_method_title();

    $items_summary = "";
    foreach ($order->get_items() as $item) {
        $items_summary .= "\n• " . $item->get_name() . " (x" . $item->get_quantity() . ")";
    }

    $msg = "*EUGINE STORE — PESANAN DITERIMA*\n\n"
         . "Halo Kak *{$name}*,\n"
         . "Terima kasih telah berbelanja di Eugine Store! Pesanan Anda telah tercatat dengan detail berikut:\n\n"
         . "📦 *No. Pesanan*: #{$order_num}\n"
         . "🛒 *Rincian Barang*:{$items_summary}\n\n"
         . "💰 *Total Tagihan*: Rp {$total}\n"
         . "💳 *Metode*: {$pay_method}\n\n"
         . "Silakan selesaikan pembayaran untuk memproses pengiriman. Butuh bantuan? Balas pesan ini untuk terhubung dengan CS kami. Terima kasih! 🙏";

    euginestore_dispatch_wa($phone, $msg);
}

// 2. Notifikasi Saat Pembayaran Berhasil (Payment Complete / Processing)
add_action('woocommerce_payment_complete', 'euginestore_send_wa_payment_success', 10, 1);
function euginestore_send_wa_payment_success($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $phone = $order->get_billing_phone();
    if (empty($phone)) return;

    $name = $order->get_billing_first_name();
    $total = number_format($order->get_total(), 0, ',', '.');
    $order_num = $order->get_order_number();

    $msg = "*EUGINE STORE — PEMBAYARAN LUNAS*\n\n"
         . "Halo Kak *{$name}*,\n"
         . "Alhamdulillah, pembayaran sebesar *Rp {$total}* untuk pesanan *#{$order_num}* telah berhasil diverifikasi! ✅\n\n"
         . "Barang Anda sedang disiapkan dan dipacking dengan aman oleh tim gudang Eugine Media. Kami akan mengabari Anda kembali setelah nomor resi pengiriman diterbitkan.\n\n"
         . "Terima kasih atas kepercayaannya! 🙏";

    euginestore_dispatch_wa($phone, $msg);
}

// 3. Notifikasi Saat Barang Dikirim (Input Nomor Resi / Status Shipped / Completed)
add_action('woocommerce_order_status_completed', 'euginestore_send_wa_shipped', 10, 1);
function euginestore_send_wa_shipped($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $phone = $order->get_billing_phone();
    if (empty($phone)) return;

    $name = $order->get_billing_first_name();
    $order_num = $order->get_order_number();
    $tracking_note = $order->get_customer_note();

    $msg = "*EUGINE STORE — PESANAN TELAH DIKIRIM*\n\n"
         . "Halo Kak *{$name}*,\n"
         . "Kabar gembira! Pesanan Anda *#{$order_num}* telah diserahkan ke pihak ekspedisi kurir untuk diantar ke alamat Anda. 🚚\n\n"
         . ($tracking_note ? "📌 *Catatan / No. Resi*: {$tracking_note}\n\n" : "")
         . "Silakan pantau status pengiriman paket Anda. Jika paket telah sampai dengan selamat, mohon konfirmasi ke kami ya Kak. Selamat berbelanja kembali di Eugine Store! 🙏";

    euginestore_dispatch_wa($phone, $msg);
}

// Helper Dispatcher ke EugineBill-wa (Port 3002)
function euginestore_dispatch_wa($target_phone, $message) {
    $clean_phone = preg_replace('/[^0-9]/', '', $target_phone);
    if (substr($clean_phone, 0, 1) === '0') {
        $clean_phone = '62' . substr($clean_phone, 1);
    }

    $payload = json_encode(array(
        'recipient' => $clean_phone,
        'message'   => $message,
    ));

    wp_remote_post('http://127.0.0.1:3002/api/send-message', array(
        'headers'     => array('Content-Type' => 'application/json'),
        'body'        => $payload,
        'timeout'     => 5,
        'blocking'    => false, // Non-blocking asynchronous
    ));
}
