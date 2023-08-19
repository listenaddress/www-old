import dynamic from 'next/dynamic'

export default function FAQs() {
    const CrispWithNoSSR = dynamic(
        () => import('../components/crisp'),
        { ssr: false }
    )
    return (
        <>
            <CrispWithNoSSR />
            <div className='m-4 mb-8 sm:ml-20 mt-[19px]'>
                <div className={`text-lg font-medium`}>FAQs</div>
                {/* Center the div, left align the text */}
                <div className={`items-center text-left max-w-[500px] mx-auto mt-10`}>
                    <span className='font-bold'>What is Streams?</span>
                    <div className='mb-6'>Streams is an app of content from a website or other source that can be read in an RSS reader.</div>
                    <span className='font-bold'>What is a stream?</span>
                    <div className='mb-6'>Streams is an app of content from a website or other source that can be read in an RSS reader.</div>
                    <span className='font-bold'>How much will streams cost?</span>
                    <div className='mb-6'>We’re not sure. We’re testing out somethings, will let you know!</div>
                    <span className='font-bold'>Who is making this?</span>
                    <div className='mb-6'>Streams is an app of content from a website or other source that can be read in an RSS reader.</div>
                </div>
            </div>
        </>
    )
}
