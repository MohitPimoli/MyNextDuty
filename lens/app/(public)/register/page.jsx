"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";
import PageContainer from "@/components/common/PageContainer";

export default function RegisterPage() {
    return (
        <PageContainer>
            <AuthLayout>
                <RegisterForm />
            </AuthLayout>
        </PageContainer>
    );
}
