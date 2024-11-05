import React, { useContext, useState } from 'react';
import LogOutButton from '../components/LogOutButton';
import AccountPageCard from '../components/AccountPageCard';

function AccountPage() {

    return (
        <>

        <AccountPageCard />
        <LogOutButton />
        </>
    );
}

export default AccountPage;
