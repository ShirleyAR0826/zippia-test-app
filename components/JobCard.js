import jobCardStyles from '../styles/Jobs.module.css'
import Link from 'next/link'

const JobCard = ({job}) => {
    //generate random color generic logo
    var colors = ['#F44336', '#FFA000', '#4CAF50', '#CCDB39', '#673AB7'];
    var random_color = colors[Math.floor(Math.random() * colors.length)];
    var style = {backgroundColor: random_color}

    //Job Card Details
    return (
        <Link href="/jobs/[id]" as={`/jobs/${job.jobId}`}>
            <a className={jobCardStyles.card} >
                {/*if company logo exists, display company logo, else use generic logo */}
                {job.companyLogo 
                    ? <div className={jobCardStyles.companyLogo} >
                        <img src={job.companyLogo}></img>
                      </div>  
                    : <div className={jobCardStyles.genericLogo} style={style} >
                        {job.companyInitial}
                      </div>
                }
                <div className={jobCardStyles.companyName}>{job.companyName}</div>
                <h2>{job.jobTitle}</h2>
                <div className={jobCardStyles.description}>{job.shortDesc}</div>
                <div className={jobCardStyles.otherDetails}>{job.postedDate}</div>
            </a>
        </Link>
    )
}

export default JobCard
