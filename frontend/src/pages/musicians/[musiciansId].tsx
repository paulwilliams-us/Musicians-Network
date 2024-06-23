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

import { update, fetch } from '../../stores/musicians/musiciansSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditMusicians = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    user: '',

    name: '',

    profile_images: [],

    contact_details: '',

    resume: '',

    education_training: '',

    experience: '',

    instruments: '',

    awards_credits: '',

    media_samples: [],

    availability: [],

    Skills: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { musicians } = useAppSelector((state) => state.musicians);

  const { musiciansId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: musiciansId }));
  }, [musiciansId]);

  useEffect(() => {
    if (typeof musicians === 'object') {
      setInitialValues(musicians);
    }
  }, [musicians]);

  useEffect(() => {
    if (typeof musicians === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = musicians[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [musicians]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: musiciansId, data }));
    await router.push('/musicians/musicians-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit musicians')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit musicians'}
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

              <FormField>
                <Field
                  label='ProfileImages'
                  color='info'
                  icon={mdiUpload}
                  path={'musicians/profile_images'}
                  name='profile_images'
                  id='profile_images'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormImagePicker}
                ></Field>
              </FormField>

              <FormField label='ContactDetails' hasTextareaHeight>
                <Field
                  name='contact_details'
                  as='textarea'
                  placeholder='ContactDetails'
                />
              </FormField>

              <FormField label='Resume' hasTextareaHeight>
                <Field
                  name='resume'
                  id='resume'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='Education/Training' hasTextareaHeight>
                <Field
                  name='education_training'
                  as='textarea'
                  placeholder='Education/Training'
                />
              </FormField>

              <FormField label='Experience' hasTextareaHeight>
                <Field
                  name='experience'
                  as='textarea'
                  placeholder='Experience'
                />
              </FormField>

              <FormField label='Instruments' hasTextareaHeight>
                <Field
                  name='instruments'
                  as='textarea'
                  placeholder='Instruments'
                />
              </FormField>

              <FormField label='AwardsandCredits' hasTextareaHeight>
                <Field
                  name='awards_credits'
                  as='textarea'
                  placeholder='AwardsandCredits'
                />
              </FormField>

              <FormField>
                <Field
                  label='MediaSamples'
                  color='info'
                  icon={mdiUpload}
                  path={'musicians/media_samples'}
                  name='media_samples'
                  id='media_samples'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormFilePicker}
                ></Field>
              </FormField>

              <FormField label='Availability' labelFor='availability'>
                <Field
                  name='availability'
                  id='availability'
                  component={SelectFieldMany}
                  options={initialValues.availability}
                  itemRef={'availability'}
                  showField={'available_from'}
                ></Field>
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
                  onClick={() => router.push('/musicians/musicians-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditMusicians.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_MUSICIANS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditMusicians;
