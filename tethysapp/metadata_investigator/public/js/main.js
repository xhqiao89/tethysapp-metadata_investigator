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
        'descriptionGeographicExtent',
        'westBoundLongitude', 'eastBoundLongitude', 'northBoundLatitude', 'southBoundLatitude',
        'organizationName', 'telephoneNumber', 'address1', 'zipcode',
        'city', 'stateProvince', 'country'
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
    const west = document.getElementById('westBoundLongitude').value;
    const east = document.getElementById('eastBoundLongitude').value;
    const north = document.getElementById('northBoundLatitude').value;
    const south = document.getElementById('southBoundLatitude').value;
    const spatialReferenceCode = document.getElementById('crs').value;
    const spatialReferenceVersion = document.getElementById('version').value;

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
    <S100FC:MD_Metadata xmlns:S100FC="http://www.iho.int/S100FC" xmlns:gco="http://www.isotc211.org/2005/gco">
        <!-- Metadata Identifier -->
        <S100FC:metadataIdentifier>
            <gco:CharacterString>${metadataId}</gco:CharacterString>
        </S100FC:metadataIdentifier>

        <!-- Dataset Identification -->
        <S100FC:identificationInfo>
            <S100FC:MD_DataIdentification>
                <S100FC:citation>
                    <S100FC:CI_Citation>
                        <S100FC:title>
                            <gco:CharacterString>${title}</gco:CharacterString>
                        </S100FC:title>
                        <S100FC:date>
                            <S100FC:CI_Date>
                                <S100FC:date>
                                    <gco:Date>${metadataDate}</gco:Date>
                                </S100FC:date>
                            </S100FC:CI_Date>
                        </S100FC:date>
                    </S100FC:CI_Citation>
                </S100FC:citation>
                <S100FC:abstract>
                    <gco:CharacterString>${abstract}</gco:CharacterString>
                </S100FC:abstract>

                ${keywords ? `
                <S100FC:descriptiveKeywords>
                    <S100FC:MD_Keywords>
                        ${keywords.split(',').map(keyword => `
                            <S100FC:keyword>
                                <gco:CharacterString>${keyword.trim()}</gco:CharacterString>
                            </S100FC:keyword>
                        `).join('')}
                    </S100FC:MD_Keywords>
                </S100FC:descriptiveKeywords>` : ''}

                ${dataAccessConstraint ? `
                <S100FC:resourceConstraints>
                    <S100FC:MD_Constraints>
                        <S100FC:accessLimitations>
                            <gco:CharacterString>${dataAccessConstraint}</gco:CharacterString>
                        </S100FC:accessLimitations>
                        <S100FC:useLimitations>
                            <gco:CharacterString>${dataUseConstraints}</gco:CharacterString>
                        </S100FC:useLimitations>
                    </S100FC:MD_Constraints>
                </S100FC:resourceConstraints>` : ''}

                <!-- Data Format -->
                <S100FC:distributionFormat>
                    <S100FC:MD_Format>
                        <S100FC:name>
                            <gco:CharacterString>${datasetFormat}</gco:CharacterString>
                        </S100FC:name>
                    </S100FC:MD_Format>
                </S100FC:distributionFormat>

                <!-- Data URL -->
                ${onlineLink ? `
                <S100FC:transferOptions>
                    <S100FC:MD_DigitalTransferOptions>
                        <S100FC:onLine>
                            <S100FC:CI_OnlineResource>
                                <S100FC:linkage>
                                    <gco:CharacterString>${onlineLink}</gco:CharacterString>
                                </S100FC:linkage>
                            </S100FC:CI_OnlineResource>
                        </S100FC:onLine>
                    </S100FC:MD_DigitalTransferOptions>
                </S100FC:transferOptions>` : ''}

                <!-- Spatial Coverage -->
                ${geographicDescription || (west || east || north || south) ? `
                <S100FC:extent>
                    <S100FC:EX_Extent>
                        ${geographicDescription ? `
                        <S100FC:description>
                            <gco:CharacterString>${geographicDescription}</gco:CharacterString>
                        </S100FC:description>` : ''}
                        <S100FC:geographicElement>
                            <S100FC:EX_GeographicBoundingBox>
                                ${west ? `<S100FC:westBoundLongitude><gco:Decimal>${west}</gco:Decimal></S100FC:westBoundLongitude>` : ''}
                                ${east ? `<S100FC:eastBoundLongitude><gco:Decimal>${east}</gco:Decimal></S100FC:eastBoundLongitude>` : ''}
                                ${north ? `<S100FC:northBoundLatitude><gco:Decimal>${north}</gco:Decimal></S100FC:northBoundLatitude>` : ''}
                                ${south ? `<S100FC:southBoundLatitude><gco:Decimal>${south}</gco:Decimal></S100FC:southBoundLatitude>` : ''}
                            </S100FC:EX_GeographicBoundingBox>
                        </S100FC:geographicElement>
                    </S100FC:EX_Extent>
                </S100FC:extent>` : ''}

                <!-- Coordinate Reference System -->
                ${spatialReferenceCode ? `
                <S100FC:referenceSystemInfo>
                    <S100FC:MD_ReferenceSystem>
                        <S100FC:referenceSystemIdentifier>
                            <S100FC:RS_Identifier>
                                <S100FC:code>
                                    <gco:CharacterString>${spatialReferenceCode}</gco:CharacterString>
                                </S100FC:code>
                                ${spatialReferenceVersion ? `
                                <S100FC:version>
                                    <gco:CharacterString>${spatialReferenceVersion}</gco:CharacterString>
                                </S100FC:version>` : ''}
                            </S100FC:RS_Identifier>
                        </S100FC:referenceSystemIdentifier>
                    </S100FC:MD_ReferenceSystem>
                </S100FC:referenceSystemInfo>` : ''}

            </S100FC:MD_DataIdentification>
        </S100FC:identificationInfo>

        <!-- Data Quality Information -->
        ${scopeLevel || lineageSummary || processStep || processDate || processStepContact || sourcesUsed || dataSourceTitle || dataSourceUrl || dataAccuracyReport ? `
        <S100FC:dataQualityInfo>
            <S100FC:DQ_DataQuality>
                ${scopeLevel ? `
                <S100FC:scope>
                    <S100FC:DQ_Scope>
                        <S100FC:level>
                            <gco:CharacterString>${scopeLevel}</gco:CharacterString>
                        </S100FC:level>
                    </S100FC:DQ_Scope>
                </S100FC:scope>` : ''}

                ${lineageSummary ? `
                <S100FC:lineage>
                    <S100FC:LI_Lineage>
                        <S100FC:statement>
                            <gco:CharacterString>${lineageSummary}</gco:CharacterString>
                        </S100FC:statement>
                    </S100FC:LI_Lineage>
                </S100FC:lineage>` : ''}

                ${processStep ? `
                <S100FC:processStep>
                    <S100FC:LI_ProcessStep>
                        <S100FC:description>
                            <gco:CharacterString>${processStep}</gco:CharacterString>
                        </S100FC:description>
                        ${processDate ? `
                        <S100FC:date>
                            <gco:Date>${processDate}</gco:Date>
                        </S100FC:date>` : ''}
                        ${processStepContact ? `
                        <S100FC:processor>
                            <S100FC:CI_ResponsibleParty>
                                <S100FC:individualName>
                                    <gco:CharacterString>${processStepContact}</gco:CharacterString>
                                </S100FC:individualName>
                            </S100FC:CI_ResponsibleParty>
                        </S100FC:processor>` : ''}
                    </S100FC:LI_ProcessStep>
                </S100FC:processStep>` : ''}

                ${sourcesUsed ? `
                <S100FC:source>
                    <S100FC:LI_Source>
                        <S100FC:title>
                            <gco:CharacterString>${sourcesUsed}</gco:CharacterString>
                        </S100FC:title>
                    </S100FC:LI_Source>
                </S100FC:source>` : ''}

                ${dataAccuracyReport ? `
                <S100FC:report>
                    <S100FC:DQ_Element>
                        <S100FC:abstract>
                            <gco:CharacterString>${dataAccuracyReport}</gco:CharacterString>
                        </S100FC:abstract>
                    </S100FC:DQ_Element>
                </S100FC:report>` : ''}
            </S100FC:DQ_DataQuality>
        </S100FC:dataQualityInfo>` : ''}

        <!-- Metadata Contact -->
        ${organization || contactPerson || positionTitle || telephone || faxNumber || email || address1 || address2 || address3 || city || state || zipcode || country ? `
        <S100FC:contact>
            <S100FC:CI_ResponsibleParty>
                ${contactPerson ? `
                <S100FC:individualName>
                    <gco:CharacterString>${contactPerson}</gco:CharacterString>
                </S100FC:individualName>` : ''}
                ${positionTitle ? `
                <S100FC:positionName>
                    <gco:CharacterString>${positionTitle}</gco:CharacterString>
                </S100FC:positionName>` : ''}
                ${telephone ? `
                <S100FC:contactInfo>
                    <S100FC:CI_Contact>
                        <S100FC:phone>
                            <S100FC:CI_Telephone>
                                <gco:CharacterString>${telephone}</gco:CharacterString>
                            </S100FC:CI_Telephone>
                        </S100FC:phone>
                    </S100FC:CI_Contact>
                </S100FC:contactInfo>` : ''}
                ${faxNumber ? `
                <S100FC:faxNumber>
                    <gco:CharacterString>${faxNumber}</gco:CharacterString>
                </S100FC:faxNumber>` : ''}
                ${email ? `
                <S100FC:email>
                    <gco:CharacterString>${email}</gco:CharacterString>
                </S100FC:email>` : ''}
                ${address1 ? `
                <S100FC:address1>
                    <gco:CharacterString>${address1}</gco:CharacterString>
                </S100FC:address1>` : ''}
                ${address2 ? `
                <S100FC:address2>
                    <gco:CharacterString>${address2}</gco:CharacterString>
                </S100FC:address2>` : ''}
                ${address3 ? `
                <S100FC:address3>
                    <gco:CharacterString>${address3}</gco:CharacterString>
                </S100FC:address3>` : ''}
                ${city ? `
                <S100FC:city>
                    <gco:CharacterString>${city}</gco:CharacterString>
                </S100FC:city>` : ''}
                ${state ? `
                <S100FC:state>
                    <gco:CharacterString>${state}</gco:CharacterString>
                </S100FC:state>` : ''}
                ${zipcode ? `
                <S100FC:zipcode>
                    <gco:CharacterString>${zipcode}</gco:CharacterString>
                </S100FC:zipcode>` : ''}
                ${country ? `
                <S100FC:country>
                    <gco:CharacterString>${country}</gco:CharacterString>
                </S100FC:country>` : ''}
            </S100FC:CI_ResponsibleParty>
        </S100FC:contact>` : ''}

    </S100FC:MD_Metadata>
`;





    const blob = new Blob([xmlContent], {type: 'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
