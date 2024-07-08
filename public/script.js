$(document).ready(function () {
    let partsValidated = [false, false, false];

    $('.check-button').on('click', function () {
        const partIndex = $(this).data('part') - 1;
        const partValue = $(`input[name="part${partIndex + 1}"]`).val();

        $.ajax({
            type: 'POST',
            url: '/check-part',
            data: { partIndex: partIndex, partValue: partValue },
            success: function (response) {
                const statusElement = $(`#part${partIndex + 1}-status`);
                if (response.success) {
                    statusElement.text('Correct').css('color', 'green');
                    partsValidated[partIndex] = true;
                    $(`input[name="part${partIndex + 1}"]`).prop('readonly', true);
                    $(`button[data-part="${partIndex + 1}"]`).prop('disabled', true);
                } else {
                    statusElement.text('Incorrect').css('color', 'red');
                    partsValidated[partIndex] = false;
                }
                checkAllPartsValidated();
            }
        });
    });

    function checkAllPartsValidated() {
        if (partsValidated.every(part => part)) {
            window.location.href = '/success';
        }
    }
});
