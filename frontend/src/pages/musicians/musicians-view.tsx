import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/musicians/musiciansSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

const MusiciansView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { musicians } = useAppSelector((state) => state.musicians);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View musicians')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View musicians')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>User</p>

            <p>{musicians?.user?.firstName ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{musicians?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>ProfileImages</p>
            {musicians?.profile_images?.length ? (
              <ImageField
                name={'profile_images'}
                image={musicians?.profile_images}
                className='w-20 h-20'
              />
            ) : (
              <p>No ProfileImages</p>
            )}
          </div>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={musicians?.contact_details}
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Resume</p>
            {musicians.resume ? (
              <p dangerouslySetInnerHTML={{ __html: musicians.resume }} />
            ) : (
              <p>No data</p>
            )}
          </div>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={musicians?.education_training}
            />
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={musicians?.experience}
            />
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={musicians?.instruments}
            />
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={musicians?.awards_credits}
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>MediaSamples</p>
            {musicians?.media_samples?.length ? (
              dataFormatter
                .filesFormatter(musicians.media_samples)
                .map((link) => (
                  <button
                    key={link.publicUrl}
                    onClick={(e) => saveFile(e, link.publicUrl, link.name)}
                  >
                    {link.name}
                  </button>
                ))
            ) : (
              <p>No MediaSamples</p>
            )}
          </div>

          <>
            <p className={'block font-bold mb-2'}>Availability</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>AvailableFrom</th>

                      <th>AvailableTo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {musicians.availability &&
                      Array.isArray(musicians.availability) &&
                      musicians.availability.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/availability/availability-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='available_from'>
                            {dataFormatter.dateTimeFormatter(
                              item.available_from,
                            )}
                          </td>

                          <td data-label='available_to'>
                            {dataFormatter.dateTimeFormatter(item.available_to)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!musicians?.availability?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Skills</p>
            <p>{musicians?.Skills}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Applications Musician</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {musicians.applications_musician &&
                      Array.isArray(musicians.applications_musician) &&
                      musicians.applications_musician.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/applications/applications-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='status'>{item.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!musicians?.applications_musician?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Availability Musician</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>AvailableFrom</th>

                      <th>AvailableTo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {musicians.availability_musician &&
                      Array.isArray(musicians.availability_musician) &&
                      musicians.availability_musician.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/availability/availability-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='available_from'>
                            {dataFormatter.dateTimeFormatter(
                              item.available_from,
                            )}
                          </td>

                          <td data-label='available_to'>
                            {dataFormatter.dateTimeFormatter(item.available_to)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!musicians?.availability_musician?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/musicians/musicians-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

MusiciansView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_MUSICIANS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default MusiciansView;
