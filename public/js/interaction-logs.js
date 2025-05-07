/* global $ */

$(document).ready(function () {
    $('#clear-all-interactions').on('click', function () {
        if (confirm('Are you sure you want to clear all interactions?!')) {
            $.ajax({
                url: '/interactions',
                type: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (response) {
                    location.reload();
                },
                error: function (e) {
                    alert('Failed to clear logs.');
                }
            });
        }
    });

    $('#select-all-interactions').on('change', function () {
        $('.log-checkbox').prop('checked', this.checked);
    });

    $('#delete-selected-interactions').on('click', function () {
        const selectedIds = $('.log-checkbox:checked').map(function () {
            return $(this).val();
        }).get();

        if (selectedIds.length === 0) {
            alert('No logs selected.');

            return;
        }

        if (confirm(`Delete ${selectedIds.length} selected logs?`)) {
            $.ajax({
                url: '/interactions/bulk',
                type: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: JSON.stringify({ ids: selectedIds }),
                success: function (response) {
                    location.reload();
                },
                error: function () {
                    alert('Failed to delete selected logs.');
                }
            });
        }
    });
});
