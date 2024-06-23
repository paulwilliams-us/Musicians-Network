import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/venues/venuesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditVenues = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    user: '',

    name: '',

    location: '',

    capacity: '',

    equipment: '',

    event_types: '',

    images: [],

    Venue_Type: '',

    Address: '',

    About: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { venues } = useAppSelector((state) => state.venues);

  const { venuesId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: venuesId }));
  }, [venuesId]);

  useEffect(() => {
    if (typeof venues === 'object') {
      setInitialValues(venues);
    }
  }, [venues]);

  useEffect(() => {
    if (typeof venues === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = venues[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [venues]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: venuesId, data }));
    await router.push('/venues/venues-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit venues')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit venues'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='User' labelFor='user'>
                <Field
                  name='user'
                  id='user'
                  component={SelectField}
                  options={initialValues.user}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='Name'>
                <Field name='name' placeholder='Name' />
              </FormField>

              <FormField label='Location'>
                <Field name='location' placeholder='Location' />
              </FormField>

              <FormField label='Capacity'>
                <Field type='number' name='capacity' placeholder='Capacity' />
              </FormField>

              <FormField label='Equipment' hasTextareaHeight>
                <Field name='equipment' as='textarea' placeholder='Equipment' />
              </FormField>

              <FormField label='EventTypes' hasTextareaHeight>
                <Field
                  name='event_types'
                  as='textarea'
                  placeholder='EventTypes'
                />
              </FormField>

              <FormField>
                <Field
                  label='Images'
                  color='info'
                  icon={mdiUpload}
                  path={'venues/images'}
                  name='images'
                  id='images'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormImagePicker}
                ></Field>
              </FormField>

              <FormField label='Venue Type'>
                <Field name='Venue_Type' placeholder='Venue Type' />
              </FormField>

              <FormField label='Address' hasTextareaHeight>
                <Field
                  name='Address'
                  id='Address'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='About' hasTextareaHeight>
                <Field
                  name='About'
                  id='About'
                  component={RichTextField}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/venues/venues-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditVenues.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_VENUES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditVenues;
