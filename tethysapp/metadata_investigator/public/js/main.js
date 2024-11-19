document.addEventListener('DOMContentLoaded', function() {
    function downloadMetadata() {
        const metadataIdentifier = document.getElementById('metadataIdentifier').value || '';
        const title = document.getElementById('title').value || '';
        const abstract = document.getElementById('abstract').value || '';
        const language = document.getElementById('language').value || '';
        const characterEncoding = document.getElementById('characterEncoding').value || '';

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Metadata>
    <MetadataIdentifier>${metadataIdentifier}</MetadataIdentifier>
    <Title>${title}</Title>
    <Abstract>${abstract}</Abstract>
    <Language>${language}</Language>
    <CharacterEncoding>${characterEncoding}</CharacterEncoding>
</Metadata>`;

        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'metadata.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const downloadButton = document.getElementById('download-metadata');
    downloadButton.addEventListener('click', downloadMetadata);
});
