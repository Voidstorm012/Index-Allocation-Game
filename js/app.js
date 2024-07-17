function addSuccessAlert(message) {
    var alert = $(`
        <div class="toast align-items-center text-bg-success border-0 w-75" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `);
    $('#alert-container').empty();
    $('#alert-container').append(alert);
    $(".toast").toast('show');
}

// Function to add an error alert
function addErrorAlert(message) {
    var alert = $(`
        <div class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `);
    $('#alert-container').empty();
    $('#alert-container').append(alert);
    $(".toast").toast('show');
}