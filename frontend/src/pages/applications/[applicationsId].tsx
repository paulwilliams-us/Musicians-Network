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

import { update, fetch } from '../../stores/applications/applicationsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditApplications = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    job: '',

    musician: '',

    status: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { applications } = useAppSelector((state) => state.applications);

  const { applicationsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: applicationsId }));
  }, [applicationsId]);

  useEffect(() => {
    if (typeof applications === 'object') {
      setInitialValues(applications);
    }
  }, [applications]);

  useEffect(() => {
    if (typeof applications === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = applications[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [applications]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: applicationsId, data }));
    await router.push('/applications/applications-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit applications')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit applications'}
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
              <FormField label='Job' labelFor='job'>
                <Field
                  name='job'
                  id='job'
                  component={SelectField}
                  options={initialValues.job}
                  itemRef={'jobs'}
                  showField={'title'}
                ></Field>
              </FormField>

              <FormField label='Musician' labelFor='musician'>
                <Field
                  name='musician'
                  id='musician'
                  component={SelectField}
                  options={initialValues.musician}
                  itemRef={'musicians'}
                  showField={'name'}
                ></Field>
              </FormField>

              <FormField label='Status'>
                <Field name='status' placeholder='Status' />
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
                  onClick={() => router.push('/applications/applications-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditApplications.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_APPLICATIONS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditApplications;
