/* global $ */

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

    _helpers.showLoader = function (show) {
        $('#loadingIndicator').toggleClass('hidden', !show);
    }

    _helpers.saveScreenshot = function (canvas) {
        const dataURL = canvas.toDataURL("image/png");
        const blob = dataURLtoBlob(dataURL);

        const formData = new FormData();

        formData.append("screenshot", blob, "screenshot.png");

        helpers.showLoader(true);

        $.ajax({
            url: '/save-screenshot',
            type: 'POST',
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                helpers.showToast('Screenshot saved!');
            },
            error: function (e) {
                helpers.showToast('Failed to save screenshot: ' + (e.responseJSON?.message || 'Unknown error'), 'error');
            },
            complete: function () {
                helpers.showLoader(false);
            }
        });
    }

    return _helpers;
})();

function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    const buffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(buffer);

    for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([buffer], { type: mimeString });
}
