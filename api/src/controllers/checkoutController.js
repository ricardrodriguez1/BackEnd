// src/controllers/checkoutController.js
const Pedido = require('../models/pedido');
const Product = require('../models/product');

const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key === 'TU_STRIPE_SECRET_KEY_AQUI') {
        throw new Error('STRIPE_SECRET_KEY no configurada. Si us plau, afegeix una clau vàlida al fitxer .env');
    }
    return require('stripe')(key);
};

/**
 * POST /api/checkout/create-session
 * Crea una sessió de Stripe Checkout amb validació de preus (4.3 & 4.6)
 */
const createSession = async (req, res) => {
    try {
        const stripe = getStripe();
        const { products, orderId } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No hi ha productes per processar' });
        }

        // VALIDACIÓ DE SEGURETAT (4.6): No confiem en els preus del frontend
        const line_items = [];
        for (const item of products) {
            // Busquem el producte a la DB per obtenir el preu real
            const dbProduct = await Product.findById(item.id || item._id);
            if (!dbProduct) {
                return res.status(404).json({ status: 'error', message: `Producte no trobat: ${item.nombre}` });
            }

            line_items.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: dbProduct.nombre,
                        images: dbProduct.imagen_url ? [dbProduct.imagen_url] : [],
                        description: dbProduct.descripcion,
                    },
                    unit_amount: Math.round(dbProduct.precio * 100), // Preu real de la DB
                },
                quantity: item.quantitat || item.quantity || 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${req.headers.origin || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin || 'http://localhost:5173'}/checkout/cancel`,
            // Passem l'ID de la comanda per poder-la identificar al Webhook
            metadata: {
                orderId: orderId
            }
        });

        return res.json({ status: 'success', id: session.id, url: session.url });
    } catch (error) {
        console.error('Error creant sessió de Stripe:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

/**
 * POST /api/checkout/webhook
 * Escolta les notificacions de Stripe per confirmar el pagament (4.5)
 */
const handleWebhook = async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Validació de la firma (4.5)
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gestionar l'esdeveniment (4.5)
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        console.log(`🔔 Pagament rebut per a la comanda: ${orderId}`);

        try {
            // Actualitzar estat de la comanda a "pagat"
            await Pedido.findByIdAndUpdate(orderId, { 
                estado: 'pagado',
                'pago.metodo': 'tarjeta',
                'pago.fecha_pago': new Date(),
                'pago.referencia': session.payment_intent,
                'pago.importe': session.amount_total / 100
            });
            console.log(`✅ Comanda ${orderId} actualitzada a 'pagado'`);
        } catch (error) {
            console.error(`❌ Error actualitzant comanda ${orderId}:`, error);
        }
    }

    res.json({ received: true });
};

module.exports = {
    createSession,
    handleWebhook
};
