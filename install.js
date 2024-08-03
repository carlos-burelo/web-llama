if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/app.js').then(function (registration) {
            console.log('Service Worker registrado con éxito:', registration);
        }, function (error) {
            console.log('Registro de Service Worker fallido:', error);
        });
    });
}