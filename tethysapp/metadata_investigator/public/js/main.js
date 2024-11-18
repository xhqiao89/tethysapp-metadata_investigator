document.addEventListener('DOMContentLoaded', function() {
    // Ensures this script executes after all DOM content has loaded.
    const downloadButton = document.getElementById('download-metadata');

    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            console.log('Download button clicked');  // Debugging line
            let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<Metadata></Metadata>`;
            const blob = new Blob([xmlContent], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'metadata.xml';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    } else {
        console.log('Download button not found');  // Debug error
    }
});
