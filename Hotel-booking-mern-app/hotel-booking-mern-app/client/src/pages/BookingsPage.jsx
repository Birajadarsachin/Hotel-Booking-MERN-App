import React, { useContext, useState } from 'react';
import LogOutButton from '../components/LogOutButton';
import AccountPageCard from '../components/AccountPageCard';

function BookingsPage() {

    return (
        <>
        <AccountPageCard />
        <LogOutButton />
        </>
    );
}

export default BookingsPage;
