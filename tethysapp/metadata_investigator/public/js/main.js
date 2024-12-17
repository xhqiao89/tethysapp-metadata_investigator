document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('download-metadata');

    downloadButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission by default
        let missingFields = getMissingFields();

        if (missingFields.length === 0) {
            downloadMetadata(); // Proceed to download if validation is successful
        } else {
            alert(`Please fill in all required fields: ${missingFields.join(', ')}`); // User feedback specifying missing fields
        }
    })
});

function getMissingFields() {
    const requiredIds = [
        'metadata-identifier', 'title', 'abstract', 'publication-date',
        'dataset-format', 'topic-category',
        'descriptionGeographicExtent', 'code',
        'westBoundLongitude', 'eastBoundLongitude', 'northBoundLatitude', 'southBoundLatitude',
        'organizationName', 'telephoneNumber', 'address1', 'zipcode'
    ];

    let missingFields = [];
    requiredIds.forEach(id => {
        const element = document.getElementById(id);
        if (!element || element.value.trim() === '') {
            missingFields.push(id.replace(/([A-Z])/g, ' $1').trim()); // Add spaces before caps for better readability
        }
    });
//    console.log('Missing Fields:', missingFields);
    return missingFields;
}

function downloadMetadata() {
    const metadataId = document.getElementById('metadata-identifier').value;
//    console.log('metadataId element:', metadataId);
//    if (metadataId) {
//        console.log('metadataId value:', metadataId.value);
//    } else {
//        console.log('metadataId element not found');
//    }
    const title = document.getElementById('title').value;
    const abstract = document.getElementById('abstract').value;
    const metadataDate = document.getElementById('publication-date').value;
    const datasetFormat = document.getElementById('dataset-format').value;
    const topicCategory = document.getElementById('topic-category').value;
    const onlineLink = document.getElementById('online-link').value;
    const keywords = document.getElementById('keywords').value;
    const dataAccessConstraint = document.getElementById('data-access-constraint').value;
    const dataUseConstraints = document.getElementById('data-use-constraints').value;
    const dataFees = document.getElementById('data-fees').value;

    //input values of data quality tab
    const scopeLevel = document.getElementById('scope-level').value;
    const lineageSummary = document.getElementById('data-lineage-summary').value;
    const processStep = document.getElementById('process-step').value;
    const processDate = document.getElementById('process-date').value;
    const processStepContact = document.getElementById('process-step-contact').value;
    const sourcesUsed = document.getElementById('sources-used').value;
    const dataSourceTitle = document.getElementById('data-source-title').value;
    const dataSourceUrl = document.getElementById('online-link-data-source').value;
    const dataAccuracyReport = document.getElementById('data-accuracy-report').value;

    //input values of spatial coverage
    const geographicDescription = document.getElementById('descriptionGeographicExtent').value;
    const spatialReferenceCode = document.getElementById('code').value;
    const spatialReferenceCodeSpace = document.getElementById('codeSpace').value;
    const spatialReferenceVersion = document.getElementById('version').value;
    const west = document.getElementById('westBoundLongitude').value;
    const east = document.getElementById('eastBoundLongitude').value;
    const north = document.getElementById('northBoundLatitude').value;
    const south = document.getElementById('southBoundLatitude').value;

    //input values of metadata reference form
    const organization = document.getElementById('organizationName').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const positionTitle = document.getElementById('titleOfPosition').value;
    const telephone = document.getElementById('telephoneNumber').value;
    const faxNumber = document.getElementById('faxNumber').value;
    const email = document.getElementById('emailAddress').value;
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const address3 = document.getElementById('address3').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('stateProvince').value;
    const zipcode = document.getElementById('zipcode').value;
    const country = document.getElementById('country').value;
    const addressType = document.getElementById('addressType').value;

//    console.log(`metadataId: ${metadataId}`);
//    console.log(`title: ${title}`);
//    console.log(`abstract: ${abstract}`);
//    console.log(`metadataDate: ${metadataDate}`);
//    console.log(`datasetFormat: ${datasetFormat}`);
//    console.log(`topicCategory: ${topicCategory}`);
//    console.log(`onlineLink: ${onlineLink}`);
//    console.log(`keywords: ${keywords}`);
//    console.log(`dataAccessConstraint: ${dataAccessConstraint}`);
//    console.log(`dataUseConstraints: ${dataUseConstraints}`);
//    console.log(`dataFees: ${dataFees}`);

    //Begin building XML content
    let xmlContent = `
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
            <S100FC:dataFees>${dataFees}</S100FC:dataFees>`;

    // Include the data quality section only if any optional field is filled
    if (scopeLevel || lineageSummary || processStep || processDate || processStepContact || sourcesUsed || dataSourceTitle || dataSourceUrl || dataAccuracyReport) {
        xmlContent += `
            <S100FC:dataQuality>
                ${scopeLevel ? `<S100FC:scopeLevel>${scopeLevel}</S100FC:scopeLevel>` : ''}
                ${lineageSummary ? `<S100FC:lineageSummary>${lineageSummary}</S100FC:lineageSummary>` : ''}
                ${processStep ? `<S100FC:processStep>${processStep}</S100FC:processStep>` : ''}
                ${processDate ? `<S100FC:processDate>${processDate}</S100FC:processDate>` : ''}
                ${processStepContact ? `<S100FC:processStepContact>${processStepContact}</S100FC:processStepContact>` : ''}
                ${sourcesUsed ? `<S100FC:sourcesUsed>${sourcesUsed}</S100FC:sourcesUsed>` : ''}
                ${dataSourceTitle ? `<S100FC:dataSourceTitle>${dataSourceTitle}</S100FC:dataSourceTitle>` : ''}
                ${dataSourceUrl ? `<S100FC:dataSourceUrl>${dataSourceUrl}</S100FC:dataSourceUrl>` : ''}
                ${dataAccuracyReport ? `<S100FC:dataAccuracyReport>${dataAccuracyReport}</S100FC:dataAccuracyReport>` : ''}
            </S100FC:dataQuality>`;
    }

    // Include the spatial coverage section only if any optional field is filled
    if (geographicDescription || spatialReferenceCode || spatialReferenceCodeSpace || spatialReferenceVersion || west || east || north || south) {
        xmlContent += `
            <S100FC:spatialCoverage>
                ${geographicDescription ? `<S100FC:geographicDescription>${geographicDescription}</S100FC:geographicDescription>` : ''}
                <S100FC:spatialReferenceSystem>
                    ${spatialReferenceCode ? `<S100FC:code>${spatialReferenceCode}</S100FC:code>` : ''}
                    ${spatialReferenceCodeSpace ? `<S100FC:codeSpace>${spatialReferenceCodeSpace}</S100FC:codeSpace>` : ''}
                    ${spatialReferenceVersion ? `<S100FC:version>${spatialReferenceVersion}</S100FC:version>` : ''}
                </S100FC:spatialReferenceSystem>
                <S100FC:boundingCoordinates>
                    ${west ? `<S100FC:west>${west}</S100FC:west>` : ''}
                    ${east ? `<S100FC:east>${east}</S100FC:east>` : ''}
                    ${north ? `<S100FC:north>${north}</S100FC:north>` : ''}
                    ${south ? `<S100FC:south>${south}</S100FC:south>` : ''}
                </S100FC:boundingCoordinates>
            </S100FC:spatialCoverage>`;
    }

    // Include the contact section only if any optional field is filled
    if (organization || contactPerson || positionTitle || telephone || faxNumber || email || address1 || address2 || address3 || city || state || zipcode || country || addressType) {
        xmlContent += `
            <S100FC:contact>
                ${organization ? `<S100FC:organization>${organization}</S100FC:organization>` : ''}
                ${contactPerson ? `<S100FC:contactPerson>${contactPerson}</S100FC:contactPerson>` : ''}
                ${positionTitle ? `<S100FC:positionTitle>${positionTitle}</S100FC:positionTitle>` : ''}
                ${telephone ? `<S100FC:telephone>${telephone}</S100FC:telephone>` : ''}
                ${faxNumber ? `<S100FC:faxNumber>${faxNumber}</S100FC:faxNumber>` : ''}
                ${email ? `<S100FC:email>${email}</S100FC:email>` : ''}
                ${address1 ? `<S100FC:address1>${address1}</S100FC:address1>` : ''}
                ${address2 ? `<S100FC:address2>${address2}</S100FC:address2>` : ''}
                ${address3 ? `<S100FC:address3>${address3}</S100FC:address3>` : ''}
                ${city ? `<S100FC:city>${city}</S100FC:city>` : ''}
                ${state ? `<S100FC:state>${state}</S100FC:state>` : ''}
                ${zipcode ? `<S100FC:zipcode>${zipcode}</S100FC:zipcode>` : ''}
                ${country ? `<S100FC:country>${country}</S100FC:country>` : ''}
                ${addressType ? `<S100FC:addressType>${addressType}</S100FC:addressType>` : ''}
            </S100FC:contact>`;
    }

    xmlContent += `
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
