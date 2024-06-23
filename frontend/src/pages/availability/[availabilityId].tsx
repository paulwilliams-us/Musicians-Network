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

import { update, fetch } from '../../stores/availability/availabilitySlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditAvailability = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    musician: '',

    available_from: new Date(),

    available_to: new Date(),
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { availability } = useAppSelector((state) => state.availability);

  const { availabilityId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: availabilityId }));
  }, [availabilityId]);

  useEffect(() => {
    if (typeof availability === 'object') {
      setInitialValues(availability);
    }
  }, [availability]);

  useEffect(() => {
    if (typeof availability === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = availability[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [availability]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: availabilityId, data }));
    await router.push('/availability/availability-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit availability')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit availability'}
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

              <FormField label='AvailableFrom'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.available_from
                      ? new Date(
                          dayjs(initialValues.available_from).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, available_from: date })
                  }
                />
              </FormField>

              <FormField label='AvailableTo'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.available_to
                      ? new Date(
                          dayjs(initialValues.available_to).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, available_to: date })
                  }
                />
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
                  onClick={() => router.push('/availability/availability-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditAvailability.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_AVAILABILITY'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditAvailability;
