import React from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

function HomePage() {
    return (
        <MainLayout>
            <div className='bg-light p-5 mt-4 rounded-3'>
                <h1>Greetings to the simple POS for small buiness</h1>
                <p>Full form of POS is Point of Sale System it is very efficient for resturants, grocery stores etc.</p>
                <p>If you have any issue, feel free to contact us.</p>
                <Link to='/pos' className='btn btn-primary'>Click here to sell products</Link>
            </div>
        </MainLayout>
    )
}

export default HomePage