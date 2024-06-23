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

import {
  update,
  fetch,
} from '../../stores/event_organizers/event_organizersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditEvent_organizers = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    user: '',

    name: '',

    contact_details: '',

    events: [],
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { event_organizers } = useAppSelector(
    (state) => state.event_organizers,
  );

  const { event_organizersId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: event_organizersId }));
  }, [event_organizersId]);

  useEffect(() => {
    if (typeof event_organizers === 'object') {
      setInitialValues(event_organizers);
    }
  }, [event_organizers]);

  useEffect(() => {
    if (typeof event_organizers === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = event_organizers[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [event_organizers]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: event_organizersId, data }));
    await router.push('/event_organizers/event_organizers-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit event_organizers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit event_organizers'}
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

              <FormField label='ContactDetails' hasTextareaHeight>
                <Field
                  name='contact_details'
                  as='textarea'
                  placeholder='ContactDetails'
                />
              </FormField>

              <FormField label='Events' labelFor='events'>
                <Field
                  name='events'
                  id='events'
                  component={SelectFieldMany}
                  options={initialValues.events}
                  itemRef={'events'}
                  showField={'name'}
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
                  onClick={() =>
                    router.push('/event_organizers/event_organizers-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditEvent_organizers.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_EVENT_ORGANIZERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditEvent_organizers;
