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

import { update, fetch } from '../../stores/jobs/jobsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditJobs = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    title: '',

    description: '',

    location: '',

    date: new Date(),

    payment: '',

    posted_by: '',

    applications: [],

    instrument: '',

    Skills: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { jobs } = useAppSelector((state) => state.jobs);

  const { jobsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: jobsId }));
  }, [jobsId]);

  useEffect(() => {
    if (typeof jobs === 'object') {
      setInitialValues(jobs);
    }
  }, [jobs]);

  useEffect(() => {
    if (typeof jobs === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = jobs[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [jobs]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: jobsId, data }));
    await router.push('/jobs/jobs-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit jobs')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit jobs'}
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
              <FormField label='Title'>
                <Field name='title' placeholder='Title' />
              </FormField>

              <FormField label='Description' hasTextareaHeight>
                <Field
                  name='description'
                  id='description'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='Location'>
                <Field name='location' placeholder='Location' />
              </FormField>

              <FormField label='Date'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.date
                      ? new Date(
                          dayjs(initialValues.date).format('YYYY-MM-DD hh:mm'),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, date: date })
                  }
                />
              </FormField>

              <FormField label='Payment'>
                <Field type='number' name='payment' placeholder='Payment' />
              </FormField>

              <FormField label='PostedBy' labelFor='posted_by'>
                <Field
                  name='posted_by'
                  id='posted_by'
                  component={SelectField}
                  options={initialValues.posted_by}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='Applications' labelFor='applications'>
                <Field
                  name='applications'
                  id='applications'
                  component={SelectFieldMany}
                  options={initialValues.applications}
                  itemRef={'applications'}
                  showField={'status'}
                ></Field>
              </FormField>

              <FormField label='Instrument'>
                <Field name='instrument' placeholder='Instrument' />
              </FormField>

              <FormField label='Skills'>
                <Field name='Skills' placeholder='Skills' />
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
                  onClick={() => router.push('/jobs/jobs-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditJobs.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_JOBS'}>{page}</LayoutAuthenticated>
  );
};

export default EditJobs;
