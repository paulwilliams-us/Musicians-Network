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

import { create } from '../../stores/jobs/jobsSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';

const initialValues = {
  title: '',
  description: '',
  location: '',
  date: '',
  payment: '',
  posted_by: '',
  applications: [],
  instrument: '',
  Skills: '',
};

const JobsNew = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/jobs/jobs-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title="New Item"
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form className="space-y-4">
              <FormField label="Title">
                <Field
                  name="title"
                  placeholder="Title"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </FormField>

              <FormField label="Description" hasTextareaHeight>
                <Field
                  name="description"
                  id="description"
                  component={RichTextField}
                  className="w-full p-2 border border-gray-300 rounded"
                ></Field>
              </FormField>

              <FormField label="Location">
                <Field
                  name="location"
                  placeholder="Location"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </FormField>

              <FormField label="Date">
                <Field
                  type="datetime-local"
                  name="date"
                  placeholder="Date"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </FormField>

              <FormField label="Payment">
                <Field
                  type="number"
                  name="payment"
                  placeholder="Payment"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </FormField>

              <FormField label="Posted By" labelFor="posted_by">
                <Field
                  name="posted_by"
                  id="posted_by"
                  component={SelectField}
                  options={[]}
                  itemRef={'users'}
                  className="w-full p-2 border border-gray-300 rounded"
                ></Field>
              </FormField>

              <FormField label="Applications" labelFor="applications">
                <Field
                  name="applications"
                  id="applications"
                  itemRef={'applications'}
                  options={[]}
                  component={SelectFieldMany}
                  className="w-full p-2 border border-gray-300 rounded"
                ></Field>
              </FormField>

              <FormField label="Instrument">
                <Field
                  name="instrument"
                  placeholder="Instrument"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </FormField>

              <FormField label="Skills">
                <Field
                  name="Skills"
                  placeholder="Skills"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton
                  type="reset"
                  color="danger"
                  outline
                  label="Cancel"
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

JobsNew.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'CREATE_JOBS'}>{page}</LayoutAuthenticated>
  );
};

export default JobsNew;
