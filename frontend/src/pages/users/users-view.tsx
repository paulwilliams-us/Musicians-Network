import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/users/usersSlice';
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

const UsersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

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
        <title>{getPageTitle('View users')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View users')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>First Name</p>
            <p>{users?.firstName}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Last Name</p>
            <p>{users?.lastName}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Phone Number</p>
            <p>{users?.phoneNumber}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>E-Mail</p>
            <p>{users?.email}</p>
          </div>

          <FormField label='Disabled'>
            <SwitchField
              field={{ name: 'disabled', value: users?.disabled }}
              form={{ setFieldValue: () => null }}
              disabled
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Avatar</p>
            {users?.avatar?.length ? (
              <ImageField
                name={'avatar'}
                image={users?.avatar}
                className='w-20 h-20'
              />
            ) : (
              <p>No Avatar</p>
            )}
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>App Role</p>

            <p>{users?.app_role?.name ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Custom Permissions</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.custom_permissions &&
                      Array.isArray(users.custom_permissions) &&
                      users.custom_permissions.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/permissions/permissions-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.custom_permissions?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Agents User</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>BusinessInformation</th>

                      <th>ContactDetails</th>

                      <th>Contact Email</th>

                      <th>Contact Number</th>

                      <th>Business Name</th>

                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.agents_user &&
                      Array.isArray(users.agents_user) &&
                      users.agents_user.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/agents/agents-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='business_info'>
                            {item.business_info}
                          </td>

                          <td data-label='contact_details'>
                            {item.contact_details}
                          </td>

                          <td data-label='Contact_Email'>
                            {item.Contact_Email}
                          </td>

                          <td data-label='Contact_Number'>
                            {item.Contact_Number}
                          </td>

                          <td data-label='Business_Name'>
                            {item.Business_Name}
                          </td>

                          <td data-label='Address'>{item.Address}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.agents_user?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Event_organizers User</p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {users.event_organizers_user &&
                      Array.isArray(users.event_organizers_user) &&
                      users.event_organizers_user.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/event_organizers/event_organizers-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='contact_details'>
                            {item.contact_details}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.event_organizers_user?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Jobs PostedBy</p>
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
                    {users.jobs_posted_by &&
                      Array.isArray(users.jobs_posted_by) &&
                      users.jobs_posted_by.map((item: any) => (
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
              {!users?.jobs_posted_by?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Musicians User</p>
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
                    {users.musicians_user &&
                      Array.isArray(users.musicians_user) &&
                      users.musicians_user.map((item: any) => (
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
              {!users?.musicians_user?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Rsvps User</p>
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
                    {users.rsvps_user &&
                      Array.isArray(users.rsvps_user) &&
                      users.rsvps_user.map((item: any) => (
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
              {!users?.rsvps_user?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <>
            <p className={'block font-bold mb-2'}>Venues User</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>

                      <th>Location</th>

                      <th>Capacity</th>

                      <th>Equipment</th>

                      <th>EventTypes</th>

                      <th>Venue Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.venues_user &&
                      Array.isArray(users.venues_user) &&
                      users.venues_user.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/venues/venues-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='name'>{item.name}</td>

                          <td data-label='location'>{item.location}</td>

                          <td data-label='capacity'>{item.capacity}</td>

                          <td data-label='equipment'>{item.equipment}</td>

                          <td data-label='event_types'>{item.event_types}</td>

                          <td data-label='Venue_Type'>{item.Venue_Type}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.venues_user?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/users/users-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

UsersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_USERS'}>{page}</LayoutAuthenticated>
  );
};

export default UsersView;
