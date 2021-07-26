import jobsListStyles from '../styles/Jobs.module.css'
import JobCard from './JobCard'

const JobsList = ({jobs}) => {
    return (
        <div className={jobsListStyles.grid}>
            {/*Display list of jobs */}
            {jobs.map(job => <JobCard job={job}/>)}
        </div>
    )
}

export default JobsList
