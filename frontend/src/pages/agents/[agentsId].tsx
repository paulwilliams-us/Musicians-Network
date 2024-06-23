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

import { update, fetch } from '../../stores/agents/agentsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditAgents = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
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
  const [initialValues, setInitialValues] = useState(initVals);

  const { agents } = useAppSelector((state) => state.agents);

  const { agentsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: agentsId }));
  }, [agentsId]);

  useEffect(() => {
    if (typeof agents === 'object') {
      setInitialValues(agents);
    }
  }, [agents]);

  useEffect(() => {
    if (typeof agents === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = agents[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [agents]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: agentsId, data }));
    await router.push('/agents/agents-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit agents')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit agents'}
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
                  component={SelectFieldMany}
                  options={initialValues.musicians}
                  itemRef={'musicians'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField label='Jobs' labelFor='jobs'>
                <Field
                  name='jobs'
                  id='jobs'
                  component={SelectFieldMany}
                  options={initialValues.jobs}
                  itemRef={'jobs'}
                  showField={'title'}
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

EditAgents.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_AGENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditAgents;
