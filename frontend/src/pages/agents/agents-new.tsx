import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
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
import { SwitchField } from '../../components/SwitchField';

import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { RichTextField } from '../../components/RichTextField';

import { create } from '../../stores/agents/agentsSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';

const initialValues = {
  user: '',

  business_info: '',

  contact_details: '',

  musicians: [],

  jobs: [],

  Contact_Email: '',

  Contact_Number: '',

  Business_Name: '',

  Address: '',
};

const AgentsNew = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/agents/agents-list');
  };
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='New Item'
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='User' labelFor='user'>
                <Field
                  name='user'
                  id='user'
                  component={SelectField}
                  options={[]}
                  itemRef={'users'}
                ></Field>
              </FormField>

              <FormField label='BusinessInformation' hasTextareaHeight>
                <Field
                  name='business_info'
                  as='textarea'
                  placeholder='BusinessInformation'
                />
              </FormField>

              <FormField label='ContactDetails' hasTextareaHeight>
                <Field
                  name='contact_details'
                  as='textarea'
                  placeholder='ContactDetails'
                />
              </FormField>

              <FormField label='Musicians' labelFor='musicians'>
                <Field
                  name='musicians'
                  id='musicians'
                  itemRef={'musicians'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <FormField label='Jobs' labelFor='jobs'>
                <Field
                  name='jobs'
                  id='jobs'
                  itemRef={'jobs'}
                  options={[]}
                  component={SelectFieldMany}
                ></Field>
              </FormField>

              <FormField label='Contact Email'>
                <Field name='Contact_Email' placeholder='Contact Email' />
              </FormField>

              <FormField label='Contact Number'>
                <Field name='Contact_Number' placeholder='Contact Number' />
              </FormField>

              <FormField label='Business Name'>
                <Field name='Business_Name' placeholder='Business Name' />
              </FormField>

              <FormField label='Address'>
                <Field name='Address' placeholder='Address' />
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
                  onClick={() => router.push('/agents/agents-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

AgentsNew.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'CREATE_AGENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default AgentsNew;
