import { Select, Dropdown, Button, Menu, Space, Radio } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import jobsStyles from '../../styles/Jobs.module.css'
import {useState} from 'react'
import Head from 'next/head'
import JobsList from '../../components/JobsList'

export default function Jobs({jobs}) {
    const [jobsListLength, setJobsListLength] = useState(10)
    const [jobsList, setJobsList] = useState(jobs.jobs)
    const [companyName, setCompanyName] = useState(null)
    const [companyNameButtonType, setCompanyNameButtonType] = useState('secondary')
    const [dateFilter, setDateFilter] = useState(null)
    const [dateFilterButtonType, setDateFilterButtonType] = useState('secondary')

    const { Option } = Select;

    //filter jobs
    function filterJobs() {
        var jobsList = jobs.jobs

        //filter based on company name
        if(companyName) jobsList= jobsList.filter(job => job.companyName === companyName)

        //filter based on date
        if(dateFilter){
            switch(dateFilter){
                case 'Past Day':
                    jobsList = jobsList.filter(job => job.postedDate.substr(job.postedDate.length - 5).charAt(0) === 'h' || (job.postedDate.substr(job.postedDate.length - 5).charAt(0) === 'd' && parseInt(job.postedDate) === 1 ))
                    break;
                case 'Past 3 Days':
                    jobsList = jobsList.filter(job => job.postedDate.substr(job.postedDate.length - 5).charAt(0) === 'd' && parseInt(job.postedDate) <= 3 )
                    break;
                case 'Past Week':
                    jobsList = jobsList.filter(job => job.postedDate.substr(job.postedDate.length - 5).charAt(0) === 'd' && parseInt(job.postedDate) <= 7 )
                    break;
                case 'Past Month':
                    jobsList = jobsList.filter(job => job.postedDate.substr(job.postedDate.length - 5).charAt(0) === 'd' && parseInt(job.postedDate) <= 30 )
                    break;
            }
        }

        //set jobs list after filter
        setJobsList(jobsList)
    }

    //handle company name filter change
    function onCompanyNameChange(value) {
        setCompanyName(value)
        setCompanyNameButtonType('primary')
        filterJobs()
    }

    //clear company name filter
    function clearCompanyNameFilter() {
        setCompanyName(null)
        setCompanyNameButtonType('secondary')
        filterJobs()
    }

    //handle date filter change
    function onDateFilterChange(event) {
        setDateFilter(event.target.value)
        setDateFilterButtonType('primary')
        filterJobs()
    }

    //clear date filter
    function clearDateFilter() {
        setDateFilter(null)
        setDateFilterButtonType('secondary')
        filterJobs()
    }

    //pop up menu for selecting company name filter
    const selectCompanyName = (
        <Menu style={{width: 400, height: 200}}>
            <div className={jobsStyles.menu}>
                <h3>Company name</h3>
                <Select
                showSearch
                style={{ width: 350 }}
                placeholder="Company Name"
                optionFilterProp="children"
                onChange={onCompanyNameChange}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {jobs.jobs.map(job => <Option key={job.jobId} value={job.companyName}>{job.companyName}</Option>)}
                </Select>
                <div className={jobsStyles.action}>
                    <Button type="text" onClick={clearCompanyNameFilter}>Clear</Button>
                    <Button type="text" onClick={filterJobs}>Apply</Button>
                </div>
            </div>
        </Menu>
    );
    
    //pop up menu for selecting date filter
    const selectDateFilter = (
        <Menu style={{width: 400, height: 200}}>
            <div className={jobsStyles.menu}>
                <h3>Date Posted</h3>
                <Radio.Group value={dateFilter} onChange={onDateFilterChange} style={{ width: 350 }}>
                    <Radio.Button value="Past Day">Past Day</Radio.Button>
                    <Radio.Button value="Past 3 Days">Past 3 Days</Radio.Button>
                    <Radio.Button value="Past Week">Past Week</Radio.Button>
                    <Radio.Button value="Past Month">Past Month</Radio.Button>
                </Radio.Group>
                <div className={jobsStyles.action}>
                    <Button type="text" onClick={clearDateFilter}>Clear</Button>
                    <Button type="text" onClick={filterJobs}>Apply</Button>
                </div>
            </div>
        </Menu>
    );

    return (
        <div className={jobsStyles.jobsPage}>
            <Head>
                <title>Jobs</title>
            </Head>
            <div className={jobsStyles.filters}>
                <Space wrap>
                    <Dropdown overlay={selectCompanyName} placement="bottomLeft" arrow>
                        {/*company name filter button */}
                        <Button size='large' type={companyNameButtonType}>
                            {!companyName ? "Company Name" : companyName} <DownOutlined />
                        </Button>
                    </Dropdown>
                    <Dropdown overlay={selectDateFilter} placement="bottomLeft" arrow>
                        {/*date filter button */}
                        <Button size='large' type={dateFilterButtonType}>
                            {!dateFilter ? "Date Posted" : dateFilter} <DownOutlined />
                        </Button>
                    </Dropdown>
                </Space>
            </div>
            {/*display first 10 jobs then incremented if show more button is clicked*/}
            <JobsList jobs={jobsList.slice(0,jobsListLength)}/>
            {/*display Show More button if more jobs are available*/}
            {jobsListLength < jobsList.length &&
            <Button 
                onClick={() => setJobsListLength(jobsListLength+10)}
                type="primary"
                size="large"
            >
                Show More
            </Button>}
        </div>
    )
  }

//Fetch data from server
export const getServerSideProps = async () => {
    const res = await fetch('https://www.zippia.com/api/jobs/', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            "companySkills": true,
            "dismissedListingHashes": [],
            "fetchJobDesc": true,
            "jobTitle": "Business Analyst",
            "locations": [],
            "numJobs": 20,
            "previousListingHashes": []
        })
      });
    
    const jobs = await res.json()

    return {
        props: {
            jobs
        }
    }

}
