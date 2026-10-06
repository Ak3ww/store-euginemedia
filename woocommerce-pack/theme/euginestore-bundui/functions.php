<?php
/**
 * EugineStore BundUI Theme Functions
 * Pure BundUI & Shadcn UI E-Commerce Child Theme
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Enqueue Styles & Google Inter Fonts
add_action('wp_enqueue_scripts', 'euginestore_enqueue_assets');
function euginestore_enqueue_assets() {
    wp_enqueue_style('storefront-parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('euginestore-bundui-style', get_stylesheet_directory_uri() . '/style.css', array('storefront-parent-style'), '1.1.0');
}

// 2. BundUI Hero Banner di Halaman Utama Toko / Katalog
add_action('woocommerce_before_shop_loop', 'euginestore_render_hero_banner', 5);
function euginestore_render_hero_banner() {
    if (is_shop() || is_front_page()) {
        ?>
        <div class="euginestore-hero-banner">
            <div class="badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Official Store &bull; Eugine Media Group
            </div>
            <h1>Pusat Perangkat Jaringan &amp; FTTH</h1>
            <p>Router MikroTik, OLT EPON/GPON, Modem ONT XPON, dan Aksesoris Fiber Optik Resmi bergaransi untuk ISP &amp; RT-RW Net seluruh Indonesia.</p>
        </div>
        <?php
    }
}

// 3. Simplifikasi Form Checkout (Buang kolom yang ribet & sesuaikan alamat Indonesia)
add_filter('woocommerce_checkout_fields', 'euginestore_simplify_checkout_fields');
function euginestore_simplify_checkout_fields($fields) {
    unset($fields['billing']['billing_company']);
    unset($fields['billing']['billing_address_2']);
    
    // Label ramah Indonesia
    if (isset($fields['billing']['billing_first_name'])) {
        $fields['billing']['billing_first_name']['label'] = 'Nama Lengkap';
        $fields['billing']['billing_first_name']['placeholder'] = 'Contoh: Ahmad Fauzi';
    }
    if (isset($fields['billing']['billing_phone'])) {
        $fields['billing']['billing_phone']['label'] = 'Nomor WhatsApp / HP Aktif';
        $fields['billing']['billing_phone']['placeholder'] = '08xxxxxxxxxx';
    }
    if (isset($fields['billing']['billing_address_1'])) {
        $fields['billing']['billing_address_1']['label'] = 'Alamat Lengkap Pengiriman';
        $fields['billing']['billing_address_1']['placeholder'] = 'Jalan, Nomor Rumah, RT/RW, Blok, Patokan';
    }
    
    return $fields;
}

// 4. Tombol Konsultasi / Order via WhatsApp di Halaman Detail Produk
add_action('woocommerce_after_add_to_cart_button', 'euginestore_add_wa_order_button');
function euginestore_add_wa_order_button() {
    global $product;
    if (!$product) return;

    $product_name = $product->get_name();
    $product_price = number_format($product->get_price(), 0, ',', '.');
    $wa_message = "Halo admin Eugine Store, saya mau konsultasi / beli produk: *{$product_name}* (Rp {$product_price}). Apakah stok masih tersedia?";
    $wa_url = "https://wa.me/6281548727257?text=" . urlencode($wa_message);

    echo '<a href="' . esc_url($wa_url) . '" target="_blank" style="margin-top: 10px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: #10b981; color: #fff; padding: 12px 18px; border-radius: 8px; font-weight: 600; text-decoration: none; box-shadow: 0 2px 6px rgba(16,185,129,0.2); transition: background 0.15s ease;">';
    echo '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>';
    echo 'Konsultasi / Order via WhatsApp';
    echo '</a>';
}

// 5. Floating WhatsApp Quick Contact Button di Footer
add_action('wp_footer', 'euginestore_render_floating_wa');
function euginestore_render_floating_wa() {
    $wa_url = "https://wa.me/6281548727257?text=" . urlencode("Halo Tim Sales Eugine Media Group, saya ingin menanyakan produk di Eugine Store.");
    echo '<a href="' . esc_url($wa_url) . '" class="eugine-floating-wa" target="_blank" rel="noopener noreferrer">';
    echo '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>';
    echo '<span>Chat Sales</span>';
    echo '</a>';
}

// 6. Modern BundUI Footer Credit
add_action('init', 'euginestore_customize_footer');
function euginestore_customize_footer() {
    remove_action('storefront_footer', 'storefront_credit', 20);
    add_action('storefront_footer', 'euginestore_render_custom_footer', 20);
}
function euginestore_render_custom_footer() {
    echo '<div style="text-align: center; padding: 24px 0; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; margin-top: 40px;">';
    echo '&copy; ' . date('Y') . ' <strong>Eugine Media Group</strong>. All rights reserved. Powered by BundUI &amp; WooCommerce.';
    echo '</div>';
}
