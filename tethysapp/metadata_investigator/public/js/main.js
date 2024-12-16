document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('download-metadata');

    downloadButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission by default
        let missingFields = getMissingFields();

        if (missingFields.length === 0) {
            downloadMetadata(); // Proceed to download if validation is successful
        } else {
            alert(`Please fill in all required fields: ${missingFields.join(', ')}.`); // User feedback specifying missing fields
        }
    });document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('download-metadata');

    downloadButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission by default
        let missingFields = getMissingFields();

        if (missingFields.length === 0) {
            downloadMetadata(); // Proceed to download if validation is successful
        } else {
            alert(`Please fill in all required fields: ${missingFields.join(', ')}.`); // User feedback specifying missing fields
        }
    });

//    // Event listeners for hiding/showing contact information
//    const organizationInput = document.getElementById('organization');
//    const individualInput = document.getElementById('individual');
//    const orgContactInfo = document.getElementById('orgContactInfo');
//    const indContactInfo = document.getElementById('indContactInfo');

    organizationInput.addEventListener('input', () => {
        if (organizationInput.value.trim() != "") {
            individualInput.disabled = true;
            indContactInfo.disabled = true;
        } else {
            individualInput.disabled = false;
            indContactInfo.disabled = false;
        }
    });

    individualInput.addEventListener('input', () => {
        if (individualInput.value.trim() != "") {
            organizationInput.disabled = true;
            orgContactInfo.disabled = true;
        } else {
            organizationInput.disabled = false;
            orgContactInfo.disabled = false;
        }
    });
});

function getMissingFields() {
    const requiredIds = [
        'metadataIdentifier', 'title', 'abstract', 'language', 'publicationDate',
        'scopeLevel', 'scopeLevelDescription', 'reportType', 'reportResult', 'lineageStatement',
        'westBoundLongitude', 'eastBoundLongitude', 'northBoundLatitude', 'southBoundLatitude',
        'organization', 'contactPerson', 'titleOfPosition', 'telephoneNumber', 'emailAddress',
        'address1', 'zipcode'
    ];

    let missingFields = [];
    requiredIds.forEach(id => {
        const element = document.getElementById(id);
        if (!element || element.value.trim() === '') {
            missingFields.push(id.replace(/([A-Z])/g, ' $1').trim()); // Add spaces before caps for better readability
        }
    });
    return missingFields;
}


function downloadMetadata() {
    // input values of identity tab
    const metadataId = document.getElementById('metadata-id').value;
    const title = document.getElementById('title').value;
    const abstract = document.getElementById('abstract').value;
    const metadataDate = document.getElementById('metadata-date').value;
    const datasetFormat = document.getElementById('dataset-format').value;
    const topicCategory = document.getElementById('topic-category').value;
    const onlineLink = document.getElementById('online-link').value;
    const keywords = document.getElementById('keywords').value;
    const dataAccessConstraint = document.getElementById('data-access-constraint').value;
    const dataUseConstraints = document.getElementById('data-use-constraints').value;
    const dataFees = document.getElementById('data-fees').value;

    //input values of data quality tab
    const scopeLevel = document.getElementById('scope-level').value;
    const lineageSummary = document.getElementById('lineage-summary').value;
    const processStep = document.getElementById('process-step').value;
    const processDate = document.getElementById('process-date').value;
    const processStepContact = document.getElementById('process-step-contact').value;
    const sourcesUsed = document.getElementById('sources-used').value;
    const dataSourceTitle = document.getElementById('data-source-title').value;
    const dataSourceUrl = document.getElementById('data-source-url').value;
    const dataAccuracyReport = document.getElementById('data-accuracy-report').value;

    //input values of spatial coverage
    const geographicDescription = document.getElementById('geographic-description').value;
    const spatialReferenceCode = document.getElementById('code').value;
    const spatialReferenceCodeSpace = document.getElementById('code-space').value;
    const spatialReferenceVersion = document.getElementById('version').value;
    const west = document.getElementById('west').value;
    const east = document.getElementById('east').value;
    const north = document.getElementById('north').value;
    const south = document.getElementById('south').value;

    //input values of metadata reference form
    const organization = document.getElementById('org-name').value;
    const contactPerson = document.getElementById('contact-person').value;
    const positionTitle = document.getElementById('position-title').value;
    const telephone = document.getElementById('telephone').value;
    const faxNumber = document.getElementById('fax').value;
    const email = document.getElementById('email').value;
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const address3 = document.getElementById('address3').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipcode = document.getElementById('zipcode').value;
    const country = document.getElementById('country').value;
    const addressType = document.getElementById('address-type').value;


    // XML template construction with template literals
    const xmlContent = `
    <S100FC:S100_FC_FeatureCatalogue xmlns:S100FC="http://www.iho.int/S100FC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.iho.int/S100FC/5.0 S100FC.xsd">
        <S100FC:metadataId>${metadataId}</S100FC:metadataId>
        <S100FC:title>${title}</S100FC:title>
        <S100FC:abstract>${abstract}</S100FC:abstract>
        <S100FC:metadataDate>${metadataDate}</S100FC:metadataDate>
        <S100FC:datasetFormat>${datasetFormat}</S100FC:datasetFormat>
        <S100FC:topicCategory>${topicCategory}</S100FC:topicCategory>
        <S100FC:onlineLink>${onlineLink}</S100FC:onlineLink>
        <S100FC:keywords>${keywords}</S100FC:keywords>
        <S100FC:dataAccessConstraint>${dataAccessConstraint}</S100FC:dataAccessConstraint>
        <S100FC:dataUseConstraints>${dataUseConstraints}</S100FC:dataUseConstraints>
        <S100FC:dataFees>${dataFees}</S100FC:dataFees>
        <S100FC:dataQuality>
            <S100FC:scopeLevel>${scopeLevel}</S100FC:scopeLevel>
            <S100FC:lineageSummary>${lineageSummary}</S100FC:lineageSummary>
            <S100FC:processStep>${processStep}</S100FC:processStep>
            <S100FC:processDate>${processDate}</S100FC:processDate>
            <S100FC:processStepContact>${processStepContact}</S100FC:processStepContact>
            <S100FC:sourcesUsed>${sourcesUsed}</S100FC:sourcesUsed>
            <S100FC:dataSourceTitle>${dataSourceTitle}</S100FC:dataSourceTitle>
            <S100FC:dataSourceUrl>${dataSourceUrl}</S100FC:dataSourceUrl>
            <S100FC:dataAccuracyReport>${dataAccuracyReport}</S100FC:dataAccuracyReport>
        </S100FC:dataQuality>
        <S100FC:spatialCoverage>
            <S100FC:geographicDescription>${geographicDescription}</S100FC:geographicDescription>
            <S100FC:spatialReferenceSystem>
                <S100FC:code>${spatialReferenceCode}</S100FC:code>
                <S100FC:codeSpace>${spatialReferenceCodeSpace}</S100FC:codeSpace>
                <S100FC:version>${spatialReferenceVersion}</S100FC:version>
            </S100FC:spatialReferenceSystem>
            <S100FC:boundingCoordinates>
                <S100FC:west>${west}</S100FC:west>
                <S100FC:east>${east}</S100FC:east>
                <S100FC:north>${north}</S100FC:north>
                <S100FC:south>${south}</S100FC:south>
            </S100FC:boundingCoordinates>
        </S100FC:spatialCoverage>
        <S100FC:contact>
            <S100FC:organization>${organization}</S100FC:organization>
            <S100FC:contactPerson>${contactPerson}</S100FC:contactPerson>
            <S100FC:positionTitle>${positionTitle}</S100FC:positionTitle>
            <S100FC:telephone>${telephone}</S100FC:telephone>
            <S100FC:faxNumber>${faxNumber}</S100FC:faxNumber>
            <S100FC:email>${email}</S100FC:email>
            <S100FC:address1>${address1}</S100FC:address1>
            <S100FC:address2>${address2}</S100FC:address2>
            <S100FC:address3>${address3}</S100FC:address3>
            <S100FC:city>${city}</S100FC:city>
            <S100FC:state>${state}</S100FC:state>
            <S100FC:zipcode>${zipcode}</S100FC:zipcode>
            <S100FC:country>${country}</S100FC:country>
            <S100FC:addressType>${addressType}</S100FC:addressType>
        </S100FC:contact>
    </S100FC:S100_FC_FeatureCatalogue>`;

    const blob = new Blob([xmlContent], {type: 'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}












//document.addEventListener('DOMContentLoaded', function() {
//    const downloadButton = document.getElementById('download-metadata');
//
//    downloadButton.addEventListener('click', function(event) {
//        event.preventDefault(); // Prevent form submission by default
//        let missingFields = getMissingFields();
//
//        if (missingFields.length === 0) {
//            downloadMetadata(); // Proceed to download if validation is successful
//        } else {
//            alert(`Please fill in all required fields: ${missingFields.join(', ')}.`); // User feedback specifying missing fields
//        }
//    });
//});
//
//function getMissingFields() {
//    const requiredIds = [
//        'metadataIdentifier', 'title', 'abstract', 'language', 'characterEncoding',
//        'westBoundLongitude', 'eastBoundLongitude', 'southBoundLatitude', 'northBoundLatitude'
//    ];
//
//    if (!document.getElementById('organization').value.trim() && !document.getElementById('individual').value.trim()) {
//        requiredIds.push('organization or individual'); // Adds to required list if none are filled
//    }
//
//    let missingFields = [];
//    requiredIds.forEach(id => {
//        const element = document.getElementById(id);
//        if (!element || element.value.trim() === '') {
//            missingFields.push(id.replace(/([A-Z])/g, ' $1').trim()); // Add spaces before caps for better readability
//        }
//    });
//    return missingFields;
//}
//
//
//function downloadMetadata() {
//    // Collect all input values
//    const metadataIdentifier = document.getElementById('metadataIdentifier').value;
//    const title = document.getElementById('title').value;
//    const abstract = document.getElementById('abstract').value;
//    const language = document.getElementById('language').value;
//    const characterEncoding = document.getElementById('characterEncoding').value;
//    const scopeLevel = document.getElementById('scopeLevel').value;
//    const scopeLevelDescription = document.getElementById('scopeLevelDescription').value;
//    const reportType = document.getElementById('reportType').value;
//    const reportResult = document.getElementById('reportResult').value;
//    const lineageStatement = document.getElementById('lineageStatement').value;
//    const westBoundLongitude = document.getElementById('westBoundLongitude').value;
//    const eastBoundLongitude = document.getElementById('eastBoundLongitude').value;
//    const southBoundLatitude = document.getElementById('southBoundLatitude').value;
//    const northBoundLatitude = document.getElementById('northBoundLatitude').value;
//    const organization = document.getElementById('organization').value;
//    const orgContactInfo = document.getElementById('orgContactInfo').value;
//    const individual = document.getElementById('individual').value;
//    const indContactInfo = document.getElementById('indContactInfo').value;
//
//    // XML template construction with template literals
//    const xmlContent = `
//    <S100FC:S100_FC_FeatureCatalogue xmlns:S100FC="http://www.iho.int/S100FC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.iho.int/S100FC/5.0 S100FC.xsd">
//        <S100FC:metadataIdentifier>${metadataIdentifier}</S100FC:metadataIdentifier>
//        <S100FC:title>${title}</S100FC:title>
//        <S100FC:abstract>${abstract}</S100FC:abstract>
//        <S100FC:language>${language}</S100FC:language>
//        <S100FC:characterEncoding>${characterEncoding}</S100FC:characterEncoding>
//        <S100FC:dataQuality>
//            <S100FC:scopeLevel>${scopeLevel}</S100FC:scopeLevel>
//            <S100FC:scopeLevelDescription>${scopeLevelDescription}</S100FC:scopeLevelDescription>
//            <S100FC:reportType>${reportType}</S100FC:reportType>
//            <S100FC:reportResult>${reportResult}</S100FC:reportResult>
//            <S100FC:lineageStatement>${lineageStatement}</S100FC:lineageStatement>
//        </S100FC:dataQuality>
//        <S100FC:spatialCoverage>
//            <S100FC:westBoundLongitude>${westBoundLongitude}</S100FC:westBoundLongitude>
//            <S100FC:eastBoundLongitude>${eastBoundLongitude}</S100FC:eastBoundLongitude>
//            <S100FC:southBoundLatitude>${southBoundLatitude}</S100FC:southBoundLatitude>
//            <S100FC:northBoundLatitude>${northBoundLatitude}</S100FC:northBoundLatitude>
//        </S100FC:spatialCoverage>
//        <S100FC:contact>
//            <S100FC:organization>${organization}</S100FC:organization>
//            <S100FC:contactInfo>${orgContactInfo}</S100FC:contactInfo>
//        </S100FC:contact>
//        <S100FC:individual>
//            <S100FC:name>${individual}</S100FC:name>
//            <S100FC:contactInfo>${indContactInfo}</S100FC:contactInfo>
//        </S100FC:individual>
//        </S100FC:S100_FC_FeatureCatalogue>`;
//
//    const blob = new Blob([xmlContent], {type: 'application/xml'});
//    const url = URL.createObjectURL(blob);
//    const a = document.createElement('a');
//    a.href = url;
//    a.download = 'metadata.xml';
//    document.body.appendChild(a);
//    a.click();
//    document.body.removeChild(a);
//}


//    // Event listeners for hiding/showing contact information
//    const organizationInput = document.getElementById('organization');
//    const individualInput = document.getElementById('individual');
//    const orgContactInfo = document.getElementById('orgContactInfo');
//    const indContactInfo = document.getElementById('indContactInfo');

    organizationInput.addEventListener('input', () => {
        if (organizationInput.value.trim() != "") {
            individualInput.disabled = true;
            indContactInfo.disabled = true;
        } else {
            individualInput.disabled = false;
            indContactInfo.disabled = false;
        }
    });

    individualInput.addEventListener('input', () => {
        if (individualInput.value.trim() != "") {
            organizationInput.disabled = true;
            orgContactInfo.disabled = true;
        } else {
            organizationInput.disabled = false;
            orgContactInfo.disabled = false;
        }
    });
});

function getMissingFields() {
    const requiredIds = [
        'metadataIdentifier', 'title', 'abstract', 'language', 'publicationDate',
        'scopeLevel', 'scopeLevelDescription', 'reportType', 'reportResult', 'lineageStatement',
        'westBoundLongitude', 'eastBoundLongitude', 'northBoundLatitude', 'southBoundLatitude',
        'organization', 'contactPerson', 'titleOfPosition', 'telephoneNumber', 'emailAddress',
        'address1', 'zipcode'
    ];

    let missingFields = [];
    requiredIds.forEach(id => {
        const element = document.getElementById(id);
        if (!element || element.value.trim() === '') {
            missingFields.push(id.replace(/([A-Z])/g, ' $1').trim()); // Add spaces before caps for better readability
        }
    });
    return missingFields;
}


function downloadMetadata() {
    // Collect all input values
    const metadataIdentifier = document.getElementById('metadataIdentifier').value;
    const title = document.getElementById('title').value;
    const abstract = document.getElementById('abstract').value;
    const language = document.getElementById('language').value;
    const publicationDate = document.getElementById('publicationDate').value;
    const scopeLevel = document.getElementById('scopeLevel').value;
    const scopeLevelDescription = document.getElementById('scopeLevelDescription').value;
    const reportType = document.getElementById('reportType').value;
    const reportResult = document.getElementById('reportResult').value;
    const lineageStatement = document.getElementById('lineageStatement').value;
    const westBoundLongitude = document.getElementById('westBoundLongitude').value;
    const eastBoundLongitude = document.getElementById('eastBoundLongitude').value;
    const northBoundLatitude = document.getElementById('northBoundLatitude').value;
    const southBoundLatitude = document.getElementById('southBoundLatitude').value;
    const organization = document.getElementById('organization').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const titleOfPosition = document.getElementById('titleOfPosition').value;
    const telephoneNumber = document.getElementById('telephoneNumber').value;
    const faxNumber = document.getElementById('faxNumber').value;
    const emailAddress = document.getElementById('emailAddress').value;
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const address3 = document.getElementById('address3').value;
    const city = document.getElementById('city').value;
    const stateProvince = document.getElementById('stateProvince').value;
    const zipcode = document.getElementById('zipcode').value;
    const country = document.getElementById('country').value;
    const addressType = document.getElementById('addressType').value;

    // XML template construction with template literals
    const xmlContent = `
    <S100FC:S100_FC_FeatureCatalogue xmlns:S100FC="http://www.iho.int/S100FC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.iho.int/S100FC/5.0 S100FC.xsd">
        <S100FC:metadataIdentifier>${metadataIdentifier}</S100FC:metadataIdentifier>
        <S100FC:title>${title}</S100FC:title>
        <S100FC:abstract>${abstract}</S100FC:abstract>
        <S100FC:language>${language}</S100FC:language>
        <S100FC:publicationDate>${publicationDate}</S100FC:publicationDate>
        <S100FC:dataQuality>
            <S100FC:scopeLevel>${scopeLevel}</S100FC:scopeLevel>
            <S100FC:scopeLevelDescription>${scopeLevelDescription}</S100FC:scopeLevelDescription>
            <S100FC:reportType>${reportType}</S100FC:reportType>
            <S100FC:reportResult>${reportResult}</S100FC:reportResult>
            <S100FC:lineageStatement>${lineageStatement}</S100FC:lineageStatement>
        </S100FC:dataQuality>
        <S100FC:spatialCoverage>
            <S100FC:westBoundLongitude>${westBoundLongitude}</S100FC:westBoundLongitude>
            <S100FC:eastBoundLongitude>${eastBoundLongitude}</S100FC:eastBoundLongitude>
            <S100FC:northBoundLatitude>${northBoundLatitude}</S100FC:northBoundLatitude>
            <S100FC:southBoundLatitude>${southBoundLatitude}</S100FC:southBoundLatitude>
        </S100FC:spatialCoverage>
        <S100FC:contact>
            <S100FC:organization>${organization}</S100FC:organization>
            <S100FC:contactPerson>${contactPerson}</S100FC:contactPerson>
            <S100FC:titleOfPosition>${titleOfPosition}</S100FC:titleOfPosition>
            <S100FC:telephoneNumber>${telephoneNumber}</S100FC:telephoneNumber>
            <S100FC:faxNumber>${faxNumber}</S100FC:faxNumber>
            <S100FC:emailAddress>${emailAddress}</S100FC:emailAddress>
            <S100FC:address1>${address1}</S100FC:address1>
            <S100FC:address2>${address2}</S100FC:address2>
            <S100FC:address3>${address3}</S100FC:address3>
            <S100FC:city>${city}</S100FC:city>
            <S100FC:stateProvince>${stateProvince}</S100FC:stateProvince>
            <S100FC:zipcode>${zipcode}</S100FC:zipcode>
            <S100FC:country>${country}</S100FC:country>
            <S100FC:addressType>${addressType}</S100FC:addressType>
        </S100FC:contact>
    </S100FC:S100_FC_FeatureCatalogue>`;

    const blob = new Blob([xmlContent], {type: 'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}












//document.addEventListener('DOMContentLoaded', function() {
//    const downloadButton = document.getElementById('download-metadata');
//
//    downloadButton.addEventListener('click', function(event) {
//        event.preventDefault(); // Prevent form submission by default
//        let missingFields = getMissingFields();
//
//        if (missingFields.length === 0) {
//            downloadMetadata(); // Proceed to download if validation is successful
//        } else {
//            alert(`Please fill in all required fields: ${missingFields.join(', ')}.`); // User feedback specifying missing fields
//        }
//    });
//});
//
//function getMissingFields() {
//    const requiredIds = [
//        'metadataIdentifier', 'title', 'abstract', 'language', 'characterEncoding',
//        'westBoundLongitude', 'eastBoundLongitude', 'southBoundLatitude', 'northBoundLatitude'
//    ];
//
//    if (!document.getElementById('organization').value.trim() && !document.getElementById('individual').value.trim()) {
//        requiredIds.push('organization or individual'); // Adds to required list if none are filled
//    }
//
//    let missingFields = [];
//    requiredIds.forEach(id => {
//        const element = document.getElementById(id);
//        if (!element || element.value.trim() === '') {
//            missingFields.push(id.replace(/([A-Z])/g, ' $1').trim()); // Add spaces before caps for better readability
//        }
//    });
//    return missingFields;
//}
//
//
//function downloadMetadata() {
//    // Collect all input values
//    const metadataIdentifier = document.getElementById('metadataIdentifier').value;
//    const title = document.getElementById('title').value;
//    const abstract = document.getElementById('abstract').value;
//    const language = document.getElementById('language').value;
//    const characterEncoding = document.getElementById('characterEncoding').value;
//    const scopeLevel = document.getElementById('scopeLevel').value;
//    const scopeLevelDescription = document.getElementById('scopeLevelDescription').value;
//    const reportType = document.getElementById('reportType').value;
//    const reportResult = document.getElementById('reportResult').value;
//    const lineageStatement = document.getElementById('lineageStatement').value;
//    const westBoundLongitude = document.getElementById('westBoundLongitude').value;
//    const eastBoundLongitude = document.getElementById('eastBoundLongitude').value;
//    const southBoundLatitude = document.getElementById('southBoundLatitude').value;
//    const northBoundLatitude = document.getElementById('northBoundLatitude').value;
//    const organization = document.getElementById('organization').value;
//    const orgContactInfo = document.getElementById('orgContactInfo').value;
//    const individual = document.getElementById('individual').value;
//    const indContactInfo = document.getElementById('indContactInfo').value;
//
//    // XML template construction with template literals
//    const xmlContent = `
//    <S100FC:S100_FC_FeatureCatalogue xmlns:S100FC="http://www.iho.int/S100FC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.iho.int/S100FC/5.0 S100FC.xsd">
//        <S100FC:metadataIdentifier>${metadataIdentifier}</S100FC:metadataIdentifier>
//        <S100FC:title>${title}</S100FC:title>
//        <S100FC:abstract>${abstract}</S100FC:abstract>
//        <S100FC:language>${language}</S100FC:language>
//        <S100FC:characterEncoding>${characterEncoding}</S100FC:characterEncoding>
//        <S100FC:dataQuality>
//            <S100FC:scopeLevel>${scopeLevel}</S100FC:scopeLevel>
//            <S100FC:scopeLevelDescription>${scopeLevelDescription}</S100FC:scopeLevelDescription>
//            <S100FC:reportType>${reportType}</S100FC:reportType>
//            <S100FC:reportResult>${reportResult}</S100FC:reportResult>
//            <S100FC:lineageStatement>${lineageStatement}</S100FC:lineageStatement>
//        </S100FC:dataQuality>
//        <S100FC:spatialCoverage>
//            <S100FC:westBoundLongitude>${westBoundLongitude}</S100FC:westBoundLongitude>
//            <S100FC:eastBoundLongitude>${eastBoundLongitude}</S100FC:eastBoundLongitude>
//            <S100FC:southBoundLatitude>${southBoundLatitude}</S100FC:southBoundLatitude>
//            <S100FC:northBoundLatitude>${northBoundLatitude}</S100FC:northBoundLatitude>
//        </S100FC:spatialCoverage>
//        <S100FC:contact>
//            <S100FC:organization>${organization}</S100FC:organization>
//            <S100FC:contactInfo>${orgContactInfo}</S100FC:contactInfo>
//        </S100FC:contact>
//        <S100FC:individual>
//            <S100FC:name>${individual}</S100FC:name>
//            <S100FC:contactInfo>${indContactInfo}</S100FC:contactInfo>
//        </S100FC:individual>
//        </S100FC:S100_FC_FeatureCatalogue>`;
//
//    const blob = new Blob([xmlContent], {type: 'application/xml'});
//    const url = URL.createObjectURL(blob);
//    const a = document.createElement('a');
//    a.href = url;
//    a.download = 'metadata.xml';
//    document.body.appendChild(a);
//    a.click();
//    document.body.removeChild(a);
//}
