/* global $ */

$(document).ready(function () {
    $('.delete-model').on('click', function () {
        const filename = $(this).data('filename');

        if (confirm(`Delete "${filename}"? This action cannot be undone.`)) {
            $.ajax({
                url: `/models/${encodeURIComponent(filename)}`,
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    location.reload();
                },
                error: function (e) {
                    alert('Failed to delete: ' + e.responseText || e.statusText);
                }
            });
        }
    });

    $('#delete-all-models').on('click', function () {
        if (confirm('Delete ALL models? This action is irreversible!')) {
            $.ajax({
                url: '/models',
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    location.reload();
                },
                error: function (e) {
                    alert('Failed to delete all models.');
                }
            });
        }
    });
});
