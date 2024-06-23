import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/agents/agentsSlice';
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

const AgentsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { agents } = useAppSelector((state) => state.agents);

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
        <title>{getPageTitle('View agents')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View agents')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>User</p>

            <p>{agents?.user?.firstName ?? 'No data'}</p>
          </div>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={agents?.business_info}
            />
          </FormField>

          <FormField label='Multi Text' hasTextareaHeight>
            <textarea
              className={'w-full'}
              disabled
              value={agents?.contact_details}
            />
          </FormField>

          <>
            <p className={'block font-bold mb-2'}>Musicians</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>ContactDetails</th>

                      <th>Education/Training</th>

                      <th>Experience</th>

                      <th>Instruments</th>

                      <th>AwardsandCredits</th>

                      <th>Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.musicians &&
                      Array.isArray(agents.musicians) &&
                      agents.musicians.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/musicians/musicians-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='contact_details'>
                            {item.contact_details}
                          </td>

                          <td data-label='education_training'>
                            {item.education_training}
                          </td>

                          <td data-label='experience'>{item.experience}</td>

                          <td data-label='instruments'>{item.instruments}</td>

                          <td data-label='awards_credits'>
                            {item.awards_credits}
                          </td>

                          <td data-label='Skills'>{item.Skills}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!agents?.musicians?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Jobs</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>

                      <th>Location</th>

                      <th>Date</th>

                      <th>Payment</th>

                      <th>Instrument</th>

                      <th>Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.jobs &&
                      Array.isArray(agents.jobs) &&
                      agents.jobs.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/jobs/jobs-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='title'>{item.title}</td>

                          <td data-label='location'>{item.location}</td>

                          <td data-label='date'>
                            {dataFormatter.dateTimeFormatter(item.date)}
                          </td>

                          <td data-label='payment'>{item.payment}</td>

                          <td data-label='instrument'>{item.instrument}</td>

                          <td data-label='Skills'>{item.Skills}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!agents?.jobs?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Contact Email</p>
            <p>{agents?.Contact_Email}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Contact Number</p>
            <p>{agents?.Contact_Number}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Business Name</p>
            <p>{agents?.Business_Name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Address</p>
            <p>{agents?.Address}</p>
          </div>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/agents/agents-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

AgentsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_AGENTS'}>{page}</LayoutAuthenticated>
  );
};

export default AgentsView;
