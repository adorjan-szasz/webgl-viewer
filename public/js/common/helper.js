const helpers = (function () {
    const _helpers = {};

    _helpers.showToast = function (message, type = 'success') {
        const toastId = 'toast-' + Date.now();
        const bgColor = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
            'bg-green-100 border-green-400 text-green-700';

        const toast = $(`
            <div id="${toastId}" class="toast-message ${bgColor} border px-4 py-3 rounded shadow max-w-xs relative opacity-0 translate-x-4 transition-all duration-300">
                <button class="absolute top-1 right-1 text-lg text-gray-500 hover:text-gray-800 font-bold leading-none focus:outline-none">&times;</button>
                <p class="pr-6">${message}</p>
            </div>
        `);

        $('#toastWrapper').append(toast);

        requestAnimationFrame(() => {
            toast.removeClass('opacity-0 translate-x-4');
        });

        toast.find('button').on('click', () => {
            toast.addClass('opacity-0 translate-x-4');
            setTimeout(() => toast.remove(), 300);
        });

        setTimeout(() => {
            toast.addClass('opacity-0 translate-x-4');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    return _helpers;
})();
