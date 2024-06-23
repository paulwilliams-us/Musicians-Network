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

import { update, fetch } from '../../stores/rsvps/rsvpsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditRsvps = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    event: '',

    user: '',

    response: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { rsvps } = useAppSelector((state) => state.rsvps);

  const { rsvpsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: rsvpsId }));
  }, [rsvpsId]);

  useEffect(() => {
    if (typeof rsvps === 'object') {
      setInitialValues(rsvps);
    }
  }, [rsvps]);

  useEffect(() => {
    if (typeof rsvps === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = rsvps[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [rsvps]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: rsvpsId, data }));
    await router.push('/rsvps/rsvps-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit rsvps')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit rsvps'}
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
              <FormField label='Event' labelFor='event'>
                <Field
                  name='event'
                  id='event'
                  component={SelectField}
                  options={initialValues.event}
                  itemRef={'events'}
                  showField={'name'}
                ></Field>
              </FormField>

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

              <FormField label='Response' labelFor='response'>
                <Field name='Response' id='Response' component='select'>
                  <option value='not_attending'>not_attending</option>

                  <option value='maybe_attending'>maybe_attending</option>

                  <option value='attending'>attending</option>
                </Field>
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
                  onClick={() => router.push('/rsvps/rsvps-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditRsvps.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_RSVPS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditRsvps;
