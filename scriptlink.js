function copyToClipboard(inputId) {
    const contractInput = document.getElementById(inputId);
    contractInput.select();
    contractInput.setSelectionRange(0, 99999); // For mobile devices

    navigator.clipboard.writeText(contractInput.value)
        .then(() => alert("Smart contract address copied to clipboard!"))
        .catch(() => alert("Failed to copy the address. Please try again."));
}
