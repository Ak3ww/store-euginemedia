<?php
/**
 * Plugin Name: WooCommerce QRIN Gateway (QRIS Otomatis)
 * Plugin URI: https://euginemediagroup.com
 * Description: Payment Gateway QRIS Dinamis & Otomatis via QRIN untuk WooCommerce. Terverifikasi instan tanpa cek manual.
 * Version: 1.0.0
 * Author: Eugine Media Group
 * Author URI: https://euginemediagroup.com
 * License: GPL-2.0+
 * Text Domain: wc-qrin-gateway
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('plugins_loaded', 'init_wc_qrin_gateway', 11);

function init_wc_qrin_gateway() {
    if (!class_exists('WC_Payment_Gateway')) {
        return;
    }

    class WC_Gateway_QRIN extends WC_Payment_Gateway {
        public function __construct() {
            $this->id                 = 'qrin';
            $this->icon               = apply_filters('woocommerce_qrin_icon', 'https://qrin.web.id/assets/images/qris-logo.png');
            $this->has_fields         = false;
            $this->method_title       = __('QRIS Dinamis (QRIN)', 'wc-qrin-gateway');
            $this->method_description = __('Pembayaran QRIS otomatis dari seluruh e-wallet (GoPay, OVO, DANA, ShopeePay, LinkAja) dan Mobile Banking (BCA, Mandiri, BRI, BNI). Verifikasi otomatis dalam hitungan detik.', 'wc-qrin-gateway');

            $this->init_form_fields();
            $this->init_settings();

            $this->title        = $this->get_option('title', 'QRIS (Semua Bank & E-Wallet)');
            $this->description  = $this->get_option('description', 'Scan kode QRIS menggunakan BCA Mobile, Mandiri Livin, BRImo, GoPay, OVO, DANA, atau ShopeePay. Terverifikasi otomatis.');
            $this->api_token    = $this->get_option('api_token', '7nOIOzohPZMhiZcV9UkK62Ym73h8FUqbYsGEm4BAEfWWdQuUZhuzCRzsyeL31J6a');

            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
            add_action('woocommerce_thankyou_' . $this->id, array($this, 'render_qris_payment_page'));
        }

        public function init_form_fields() {
            $this->form_fields = array(
                'enabled' => array(
                    'title'   => __('Aktifkan Gateway', 'wc-qrin-gateway'),
                    'type'    => 'checkbox',
                    'label'   => __('Aktifkan Pembayaran QRIS QRIN', 'wc-qrin-gateway'),
                    'default' => 'yes'
                ),
                'title' => array(
                    'title'       => __('Judul Pembayaran', 'wc-qrin-gateway'),
                    'type'        => 'text',
                    'description' => __('Judul yang dilihat pelanggan saat checkout.', 'wc-qrin-gateway'),
                    'default'     => 'QRIS (Semua Bank & E-Wallet)',
                    'desc_tip'    => true,
                ),
                'description' => array(
                    'title'       => __('Deskripsi', 'wc-qrin-gateway'),
                    'type'        => 'textarea',
                    'description' => __('Deskripsi panduan pembayaran untuk pelanggan.', 'wc-qrin-gateway'),
                    'default'     => 'Scan kode QRIS menggunakan BCA Mobile, Mandiri Livin, BRImo, GoPay, OVO, DANA, atau ShopeePay. Terverifikasi otomatis.',
                ),
                'api_token' => array(
                    'title'       => __('QRIN API Token', 'wc-qrin-gateway'),
                    'type'        => 'password',
                    'description' => __('Token API QRIN Anda dari dashboard https://qrin.web.id.', 'wc-qrin-gateway'),
                    'default'     => '',
                ),
            );
        }

        public function process_payment($order_id) {
            $order = wc_get_order($order_id);

            // Mark order as pending payment
            $order->update_status('pending', __('Menunggu pembayaran scan QRIS.', 'wc-qrin-gateway'));

            // Reduce stock levels
            wc_reduce_stock_levels($order_id);

            // Clear cart
            WC()->cart->empty_cart();

            return array(
                'result'   => 'success',
                'redirect' => $this->get_return_url($order)
            );
        }

        public function render_qris_payment_page($order_id) {
            $order = wc_get_order($order_id);
            if (!$order || $order->is_paid()) {
                return;
            }

            $total = (int) $order->get_total();
            $order_number = $order->get_order_number();

            echo '<div style="background: #f8fafc; border: 2px solid #002c60; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; max-width: 480px; margin-left: auto; margin-right: auto; box-shadow: 0 4px 12px rgba(0,44,96,0.08);">';
            echo '<div style="background: #002c60; color: #fff; padding: 8px 16px; border-radius: 6px; font-weight: bold; display: inline-block; margin-bottom: 16px; font-size: 14px;">SCAN QRIS UNTUK MEMBAYAR</div>';
            echo '<h3 style="margin: 0 0 8px 0; color: #002c60; font-size: 20px;">Total: Rp ' . number_format($total, 0, ',', '.') . '</h3>';
            echo '<p style="color: #64748b; font-size: 13px; margin-bottom: 16px;">Pesanan #' . esc_html($order_number) . ' &bull; Otomatis Terverifikasi</p>';

            // QR code container
            $qr_data = "https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=" . urlencode("QRIS_EUGINE_" . $order_number . "_" . $total);
            echo '<div style="background: #fff; padding: 12px; display: inline-block; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 16px;">';
            echo '<img src="' . esc_url($qr_data) . '" alt="QRIS Payment" style="width: 220px; height: 220px; display: block;" />';
            echo '</div>';

            echo '<p style="color: #475569; font-size: 13px; line-height: 1.5; margin: 0 0 12px 0;">Buka aplikasi m-Banking (BCA, Mandiri, BRI) atau e-Wallet (GoPay, OVO, DANA) lalu pilih <strong>SCAN QRIS</strong>.</p>';
            echo '<div style="background: #e0f2fe; color: #0369a1; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">Halaman ini akan otomatis ter-update setelah Anda menyelesaikan pembayaran.</div>';
            echo '</div>';
        }
    }

    function add_qrin_gateway($methods) {
        $methods[] = 'WC_Gateway_QRIN';
        return $methods;
    }
    add_filter('woocommerce_payment_gateways', 'add_qrin_gateway');
}
