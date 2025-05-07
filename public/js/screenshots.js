/* global $ */

$(document).ready(function () {
    $('.delete-screenshot').on('click', function () {
        if (!confirm('Are you sure you want to delete this screenshot?')) return;

        const button = $(this);
        const filename = button.data('filename');

        $.ajax({
            url: `/screenshots/${encodeURIComponent(filename)}`,
            type: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function () {
                button.closest('div.border').fadeOut(300, function () {
                    $(this).remove();
                });
            },
            error: function () {
                alert('Failed to delete screenshot.');
            }
        });
    });

    $('#delete-all-screenshots').on('click', function () {
        if (confirm('Delete ALL screenshots? This action is irreversible!')) {
            $.ajax({
                url: '/screenshots',
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
