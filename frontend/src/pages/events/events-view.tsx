import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/events/eventsSlice';
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

const EventsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { events } = useAppSelector((state) => state.events);

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
        <title>{getPageTitle('View events')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View events')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Name</p>
            <p>{events?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Description</p>
            {events.description ? (
              <p dangerouslySetInnerHTML={{ __html: events.description }} />
            ) : (
              <p>No data</p>
            )}
          </div>

          <FormField label='StartDate'>
            {events.start_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  events.start_date
                    ? new Date(
                        dayjs(events.start_date).format('YYYY-MM-DD hh:mm'),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No StartDate</p>
            )}
          </FormField>

          <FormField label='EndDate'>
            {events.end_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  events.end_date
                    ? new Date(
                        dayjs(events.end_date).format('YYYY-MM-DD hh:mm'),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No EndDate</p>
            )}
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Venue</p>

            <p>{events?.venue?.name ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Organizer</p>

            <p>{events?.organizer?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>RSVPs</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.rsvps &&
                      Array.isArray(events.rsvps) &&
                      events.rsvps.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/rsvps/rsvps-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='response'>{item.response}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!events?.rsvps?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Rsvps Event</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.rsvps_event &&
                      Array.isArray(events.rsvps_event) &&
                      events.rsvps_event.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/rsvps/rsvps-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='response'>{item.response}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!events?.rsvps_event?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/events/events-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

EventsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_EVENTS'}>{page}</LayoutAuthenticated>
  );
};

export default EventsView;
