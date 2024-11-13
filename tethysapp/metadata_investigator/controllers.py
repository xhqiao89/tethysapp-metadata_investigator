from django.shortcuts import render
from django.http import JsonResponse
from tethys_sdk.routing import controller
from tethys_sdk.gizmos import Button
import json
import os
from django.conf import settings
import xmltodict
from jsonschema import validate, ValidationError


@controller
def home(request):
    """
    Controller for the app home page.
    """
    save_button = Button(
        display_text='',
        name='save-button',
        icon='save',
        style='success',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Save'
        }
    )

    edit_button = Button(
        display_text='',
        name='edit-button',
        icon='pen',
        style='warning',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Edit'
        }
    )

    remove_button = Button(
        display_text='',
        name='remove-button',
        icon='trash',
        style='danger',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Remove'
        }
    )

    previous_button = Button(
        display_text='Previous',
        name='previous-button',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Previous'
        }
    )

    next_button = Button(
        display_text='Next',
        name='next-button',
        attributes={
            'data-bs-toggle':'tooltip',
            'data-bs-placement':'top',
            'title':'Next'
        }
    )

    context = {
        'save_button': save_button,
        'edit_button': edit_button,
        'remove_button': remove_button,
        'previous_button': previous_button,
        'next_button': next_button
    }

    return render(request, 'metadata_investigator/home.html', context)


##Getting the current working directory of controllers.py
current_dir = os.path.dirname(os.path.abspath(__file__))

##Construncting the path to the schema file
schema_path = os.path.join(current_dir, 'templates', 'metadata_investigator', 'schema', 'my_schema.json')

##Loading the JSON schema
with open(schema_path, 'r') as schema_file:
    json_schema = json.load(schema_file)


@controller(name='upload_file', url='metadata-investigator/upload')
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']

        if not uploaded_file.name.endswith('.xml'):
            return render(request, 'metadata_investigator/home.html', {'error': 'Please upload an XML file.'})

        # Read and parse the XML file
        xml_content = uploaded_file.read().decode('utf-8')
        try:
            # Convert XML to JSON
            json_data = xmltodict.parse(xml_content)

            # Validate against JSON schema
            validate(instance=json_data, schema=json_schema)
        except xmltodict.ExpatError as e:
            return render(request, 'metadata_investigator/home.html', {'error': f'Error parsing XML: {str(e)}'})
        except ValidationError as e:
            return render(request, 'metadata_investigator/home.html', {'error': f'Schema validation error: {str(e)}'})

        # Extract metadata
        metadata = json_data.get('MD_Metadata', {})

        # Define required fields and process attributes
        required_fields = [
            'metadataIdentifier', 'dateInfo', 'resourceScope', 'title', 'abstract', 'topicCategory',
            'language', 'characterEncoding'  # Fields in 'defaultLocale', 'language' in the required defaultLocale
        ]
        attributes, missing_attributes = get_required_attributes(metadata, required_fields)

        # Handle more complex and specific structures
        attributes.update(handle_contacts(metadata))
        attributes.update(handle_extent(metadata))
        attributes.update(handle_feature_catalogue(json_data))

        return render(request, 'metadata_investigator/display_attributes.html', {
            'attributes': attributes,
            'missing_attributes': missing_attributes,
            'full_json': json.dumps(json_data, indent=2)
        })


def get_required_attributes(metadata, required_fields):
    attributes = {}
    missing_attributes = {}

    for field in required_fields:
        if field in ['language', 'characterEncoding']:  # nested in 'defaultLocale'
            value = metadata.get('defaultLocale', {}).get(field, '')
        elif field in ['title', 'abstract', 'topicCategory']:  # nested in 'identificationInfo'
            value = metadata.get('identificationInfo', {}).get(field, '')
        else:
            value = metadata.get(field, '')

        attributes[field] = value
        missing_attributes[field] = "Missing" if value == '' else "Present"

    return attributes, missing_attributes


def handle_contacts(metadata):
    attributes = {}
    contacts = metadata.get('contact', [])
    if isinstance(contacts, dict):
        contacts = [contacts]  # Ensure it's a list even if there's only one
    for i, contact in enumerate(contacts):
        prefix = f'contact_{i + 1}'
        attributes[f'{prefix}_organisation'] = contact.get('organisation', '')
        attributes[f'{prefix}_individual'] = contact.get('individual', '')
        attributes[f'{prefix}_positionName'] = contact.get('positionName', '')
        attributes[f'{prefix}_contactInfo'] = contact.get('contactInfo', '')
    return attributes


def handle_extent(metadata):
    attributes = {}
    extent = metadata.get('identificationInfo', {}).get('extent', {})
    attributes.update({
        'geographicDescription': extent.get('geographicDescription', ''),
        'westBoundLongitude': extent.get('westBoundLongitude', ''),
        'eastBoundLongitude': extent.get('eastBoundLongitude', ''),
        'southBoundLatitude': extent.get('southBoundLatitude', ''),
        'northBoundLatitude': extent.get('northBoundLatitude', ''),
    })
    return attributes


def handle_feature_catalogue(json_data):
    attributes = {}
    feature_catalogue = json_data.get('S100FC:S100_FC_FeatureCatalogue', {})
    attributes.update({
        'fc_name': feature_catalogue.get('S100FC:name', ''),
        'fc_scope': feature_catalogue.get('S100FC:scope', ''),
        'fc_fieldOfApplication': feature_catalogue.get('S100FC:fieldOfApplication', ''),
        'fc_versionNumber': feature_catalogue.get('S100FC:versionNumber', ''),
        'fc_versionDate': feature_catalogue.get('S100FC:versionDate', ''),
        'fc_productId': feature_catalogue.get('S100FC:productId', ''),
        'fc_classification': feature_catalogue.get('S100FC:classification', ''),
    })
    return attributes

# @controller(name='upload_file', url='metadata-investigator/upload')
# def upload_file(request):
#     if request.method == 'POST' and request.FILES.get('file'):
#         uploaded_file = request.FILES['file']
#
#         if not uploaded_file.name.endswith('.xml'):
#             return render(request, 'metadata_investigator/home.html', {'error': 'Please upload an XML file.'})
#
#         # Read and parse the XML file
#         xml_content = uploaded_file.read().decode('utf-8')
#         try:
#             # Convert XML to JSON
#             json_data = xmltodict.parse(xml_content)
#
#             # Validate against JSON schema
#             validate(instance=json_data, schema=json_schema)
#         except xmltodict.expat.ExpatError as e:
#             return render(request, 'metadata_investigator/home.html', {'error': f'Error parsing XML: {str(e)}'})
#         except ValidationError as e:
#             return render(request, 'metadata_investigator/home.html', {'error': f'Schema validation error: {str(e)}'})
#
#         # Extract relevant attributes
#         metadata = json_data.get('MD_Metadata', {})
#         attributes = {
#             'metadataIdentifier': metadata.get('metadataIdentifier', ''),
#             'parentMetadata': metadata.get('parentMetadata', ''),
#             'language': metadata.get('defaultLocale', {}).get('language', ''),
#             'characterEncoding': metadata.get('defaultLocale', {}).get('characterEncoding', ''),
#             'dateInfo': metadata.get('dateInfo', ''),
#             'resourceScope': metadata.get('metadataScope', {}).get('resourceScope', ''),
#             'scopeName': metadata.get('metadataScope', {}).get('name', ''),
#             'title': metadata.get('identificationInfo', {}).get('title', ''),
#             'abstract': metadata.get('identificationInfo', {}).get('abstract', ''),
#             'topicCategory': metadata.get('identificationInfo', {}).get('topicCategory', ''),
#         }
#
#         # Handle contact information (potentially multiple contacts)
#         contacts = metadata.get('contact', [])
#         if isinstance(contacts, dict):
#             contacts = [contacts]  # Ensure it's a list even if there's only one contact
#         for i, contact in enumerate(contacts):
#             attributes[f'contact_{i+1}_organisation'] = contact.get('organisation', '')
#             attributes[f'contact_{i+1}_individual'] = contact.get('individual', '')
#             attributes[f'contact_{i+1}_positionName'] = contact.get('positionName', '')
#             attributes[f'contact_{i+1}_contactInfo'] = contact.get('contactInfo', '')
#
#         # Handle extent information
#         extent = metadata.get('identificationInfo', {}).get('extent', {})
#         attributes.update({
#             'geographicDescription': extent.get('geographicDescription', ''),
#             'westBoundLongitude': extent.get('westBoundLongitude', ''),
#             'eastBoundLongitude': extent.get('eastBoundLongitude', ''),
#             'southBoundLatitude': extent.get('southBoundLatitude', ''),
#             'northBoundLatitude': extent.get('northBoundLatitude', ''),
#         })
#
#         # Handle S100FC:S100_FC_FeatureCatalogue
#         feature_catalogue = json_data.get('S100FC:S100_FC_FeatureCatalogue', {})
#         attributes.update({
#             'fc_name': feature_catalogue.get('S100FC:name', ''),
#             'fc_scope': feature_catalogue.get('S100FC:scope', ''),
#             'fc_fieldOfApplication': feature_catalogue.get('S100FC:fieldOfApplication', ''),
#             'fc_versionNumber': feature_catalogue.get('S100FC:versionNumber', ''),
#             'fc_versionDate': feature_catalogue.get('S100FC:versionDate', ''),
#             'fc_productId': feature_catalogue.get('S100FC:productId', ''),
#             'fc_classification': feature_catalogue.get('S100FC:classification', ''),
#         })
#
#         return render(request, 'metadata_investigator/display_attributes.html', {
#             'attributes': attributes,
#             'full_json': json.dumps(json_data, indent=2)
#         })