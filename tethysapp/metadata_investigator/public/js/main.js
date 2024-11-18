document.addEventListener('DOMContentLoaded', function() {
    console.log('Document is fully loaded and parsed.');
    console.log("Document ready!");
    function downloadBlankXML() {
        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<Metadata></Metadata>`;
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'blank_metadata.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const downloadButton = document.getElementById('download-metadata');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadBlankXML);
    }
});
