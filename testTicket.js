const { printPreview, printTicket, logo } = require('./core/ticket');

async function testPrint() {
    let content = `${logo}\n\nTest d'impression.\nMerci de votre visite !`;
    // Teste d'abord l'aperçu de l'impression
    await printPreview(content);

    // Teste ensuite l'impression réelle
    await printTicket(content);
}

testPrint().catch(console.error);
