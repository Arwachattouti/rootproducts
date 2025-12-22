import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import {
    Book,
    CheckCircle,
    Download,
    MailCheck,
    Users,
    Star,
    AlertCircle,
    Loader2,
    Package,
    Video,
    Award,
    Clock,
    Globe,
    Gift
} from "lucide-react";
import { PaymentService } from "shared/services/payment.service";
import { emailService } from "shared/services/api/email.service";
import { UserService } from "shared/services/user.service";
import { useAuth } from "../../hooks/useAuth";

function ConfirmedPayment() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [emailSent, setEmailSent] = useState(false);
    const [processing, setProcessing] = useState(true);
    const [status, setStatus] = useState('processing');
    const [transactionData, setTransactionData] = useState(null);
    const [paymentToken, setPaymentToken] = useState('');
    const [itemType, setItemType] = useState(null);
    const [itemData, setItemData] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState({
        attempted: false,
        success: false,
        error: null,
        courseId: null,
        userId: null,
        method: null
    });
    const [authChecked, setAuthChecked] = useState(false);
    const [foundUserByEmail, setFoundUserByEmail] = useState(null);
    const [directEnrollmentAttempted, setDirectEnrollmentAttempted] = useState(false);
    const [userReady, setUserReady] = useState(false);

    // Wait for auth to be ready AND user object to be available
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            // Check if user object is properly loaded
            if (user && (user.id || user.uid || user.email)) {
                setUserReady(true);
                setAuthChecked(true);
            } else {
                // Wait a bit more for user object
                setTimeout(() => {
                    if (user && (user.id || user.uid || user.email)) {
                        setUserReady(true);
                        setAuthChecked(true);
                    } else {
                        setAuthChecked(true);
                    }
                }, 500);
            }
        } else if (!authLoading) {
            setAuthChecked(true);
        }
    }, [authLoading, isAuthenticated, user]);

    const fetchTransactionDirect = async (transactionId) => {
        try {
            const API_BASE_URL = 'https://plat-educative-4kwu.vercel.app/api';
            const response = await fetch(`${API_BASE_URL}/paiements/transactions/${transactionId}`);
            
            if (!response.ok) {
                return null;
            }
            
            const data = await response.json();
            
            if (data.success && data.data) {
                return data.data;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };

    const getPaymentTokenFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('payment_token') || urlParams.get('token') || '';
        return token;
    };

    const getTransactionId = () => {
        const transactionId = 
            sessionStorage.getItem('currentTransactionId') || 
            sessionStorage.getItem('courseTransactionId') ||
            sessionStorage.getItem('packTransactionId');
        
        if (transactionId) {
            return transactionId;
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('transaction_id');
        if (urlId) {
            return urlId;
        }
        
        return null;
    };

    const determineItemType = (transaction) => {
        if (transaction?.metadata?.itemType) {
            return transaction.metadata.itemType;
        }
        
        const sessionData = 
            sessionStorage.getItem('paymentSessionData') ||
            sessionStorage.getItem('coursePaymentSessionData') ||
            sessionStorage.getItem('packPaymentSessionData');
        
        if (sessionData) {
            try {
                const parsed = JSON.parse(sessionData);
                const itemType = parsed.itemType || (parsed.course ? 'course' : 'pack');
                return itemType;
            } catch (e) {
                // Ignore parsing error
            }
        }
        
        if (transaction?.note?.includes('Cours:')) {
            return 'course';
        }
        if (transaction?.note?.includes('Abonnement')) {
            return 'pack';
        }
        if (transaction?.metadata?.courseId) {
            return 'course';
        }
        if (transaction?.metadata?.subscriptionId) {
            return 'pack';
        }
        
        return 'unknown';
    };

    const updateTransactionStatus = async (transactionId, token) => {
        if (!transactionId || !token) {
            return false;
        }
        
        try {
            const result = await PaymentService.updateTransactionStatus(transactionId, {
                status: 'paid',
                paymeeTransactionId: token,
                paymentMethod: 'paymee',
                paidAt: new Date().toISOString()
            });
            
            if (result.success) {
                return true;
            }
            
            // Fallback to direct API
            const API_BASE_URL = 'https://plat-educative-4kwu.vercel.app/api';
            const response = await fetch(`${API_BASE_URL}/paiements/transactions/${transactionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'paid',
                    paymeeTransactionId: token,
                    paymentMethod: 'paymee',
                    paidAt: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                return true;
            } else {
                return false;
            }
            
        } catch (error) {
            return false;
        }
    };

    // Find user by email from transaction
    const findUserByTransactionEmail = async (transaction) => {
        try {
            const email = transaction?.customer?.email;
            if (!email) {
                return null;
            }
            
            const userFound = await UserService.getUserByEmail(email);
            
            if (userFound) {
                // Update state for UI
                setFoundUserByEmail(userFound);
                return userFound;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };

    // Find user by authenticated email
    const findUserByAuthenticatedEmail = async () => {
        try {
            if (!user?.email) {
                return null;
            }
            
            const userFound = await UserService.getUserByEmail(user.email);
            
            if (userFound) {
                setFoundUserByEmail(userFound);
                return userFound;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };

    // Main enrollment function
    const enrollUserInCourse = async (courseId) => {
        let targetUserId = null;
        let enrollmentMethod = '';
        
        // SIMPLIFIED LOGIC: Always prioritize the authenticated user's ID
        if (isAuthenticated) {
            // Get user ID from the user object
            const userId = user?.id || user?.uid;
            
            if (userId) {
                targetUserId = userId;
                enrollmentMethod = 'authenticated_user';
            }
            // If we have email but no ID, find by email
            else if (user?.email) {
                try {
                    const foundUser = await findUserByAuthenticatedEmail();
                    if (foundUser?.id) {
                        targetUserId = foundUser.id;
                        enrollmentMethod = 'authenticated_user_by_email';
                    }
                } catch (error) {
                    // Ignore error
                }
            }
        }
        
        // If still no user, try transaction email
        if (!targetUserId && transactionData?.customer?.email) {
            try {
                const foundUser = await findUserByTransactionEmail(transactionData);
                if (foundUser?.id) {
                    targetUserId = foundUser.id;
                    enrollmentMethod = 'transaction_email';
                }
            } catch (error) {
                // Ignore error
            }
        }
        
        if (!targetUserId) {
            const errorMsg = 'No user ID available for enrollment';
            
            setEnrollmentStatus({
                attempted: true,
                success: false,
                error: errorMsg,
                courseId,
                userId: null,
                method: enrollmentMethod
            });
            return false;
        }
        
        if (!courseId || typeof courseId !== 'string' || courseId.trim() === '') {
            const errorMsg = 'Invalid course ID';
            setEnrollmentStatus({
                attempted: true,
                success: false,
                error: errorMsg,
                courseId,
                userId: targetUserId,
                method: enrollmentMethod
            });
            return false;
        }
        
        const cleanCourseId = courseId.trim();
        
        try {
            const result = await UserService.ajouterCoursAchete(targetUserId, cleanCourseId);
            
            if (result && result.success) {
                setEnrollmentStatus({
                    attempted: true,
                    success: true,
                    error: null,
                    courseId: cleanCourseId,
                    userId: targetUserId,
                    method: enrollmentMethod
                });
                
                sessionStorage.setItem('lastCourseEnrollment', JSON.stringify({
                    userId: targetUserId,
                    courseId: cleanCourseId,
                    timestamp: new Date().toISOString(),
                    method: enrollmentMethod
                }));
                
                return true;
            } else {
                setEnrollmentStatus({
                    attempted: true,
                    success: false,
                    error: result?.error || 'UserService failed',
                    courseId: cleanCourseId,
                    userId: targetUserId,
                    method: enrollmentMethod
                });
            }
        } catch (error) {
            setEnrollmentStatus({
                attempted: true,
                success: false,
                error: error.message,
                courseId: cleanCourseId,
                userId: targetUserId,
                method: `${enrollmentMethod}_error`
            });
        }
        
        return false;
    };

    // Direct enrollment test for debugging
    const testDirectEnrollment = async () => {
        try {
            setDirectEnrollmentAttempted(true);
            
            const testCourseId = enrollmentStatus.courseId || 
                                 transactionData?.metadata?.courseId || 
                                 '8lwbWn8jYLmHvustJpOS';
            
            if (!testCourseId) {
                return { success: false, error: 'No course ID' };
            }
            
            const result = await enrollUserInCourse(testCourseId);
            
            return { success: result, error: result ? null : 'Enrollment failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const enrollUserInPack = async (subscriptionId) => {
        let targetUserId = null;
        
        if (user?.uid) {
            targetUserId = user.uid;
        } else if (foundUserByEmail?.id) {
            targetUserId = foundUserByEmail.id;
        } else if (transactionData?.customer?.email) {
            const foundUser = await findUserByTransactionEmail(transactionData);
            if (foundUser?.id) {
                targetUserId = foundUser.id;
                setFoundUserByEmail(foundUser);
            }
        }

        if (!targetUserId) {
            return false;
        }

        try {
            const result = await UserService.ajouterPackAchete(targetUserId, subscriptionId, transactionData);
            return result.success;
            
        } catch (error) {
            return false;
        }
    };

    const getCourseIdFromMultipleSources = (transaction, sessionData) => {
        const sources = [];
        
        if (transaction?.metadata?.courseId) {
            sources.push({
                source: 'transaction.metadata.courseId',
                value: transaction.metadata.courseId
            });
        }
        
        if (sessionData?.course?.id) {
            sources.push({
                source: 'sessionData.course.id',
                value: sessionData.course.id
            });
        }
        
        if (sessionData?.courseId) {
            sources.push({
                source: 'sessionData.courseId',
                value: sessionData.courseId
            });
        }
        
        if (transaction?.note) {
            const noteMatch = transaction.note.match(/Cours:?\s*([A-Za-z0-9_-]+)/i);
            if (noteMatch && noteMatch[1]) {
                sources.push({
                    source: 'transaction.note parsing',
                    value: noteMatch[1]
                });
            }
        }
        
        const storedCourseId = sessionStorage.getItem('selectedCourseId');
        if (storedCourseId) {
            sources.push({
                source: 'sessionStorage.selectedCourseId',
                value: storedCourseId
            });
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlCourseId = urlParams.get('course_id') || urlParams.get('courseId');
        if (urlCourseId) {
            sources.push({
                source: 'URL parameter',
                value: urlCourseId
            });
        }
        
        for (const source of sources) {
            if (source.value && typeof source.value === 'string' && source.value.trim() !== '') {
                return source.value.trim();
            }
        }
        
        return null;
    };

    const getItemDataFromSession = () => {
        const sessionKeys = [
            'paymentSessionData',
            'coursePaymentSessionData',
            'packPaymentSessionData'
        ];
        
        for (const key of sessionKeys) {
            const data = sessionStorage.getItem(key);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    return parsed;
                } catch (e) {
                    continue;
                }
            }
        }
        return null;
    };

    const sendConfirmationEmail = async (transaction, token, itemType, itemData) => {
        try {
            const email = transaction?.customer?.email || user?.email;
            const firstName = transaction?.customer?.firstName || 'Client';
            const lastName = transaction?.customer?.lastName || '';
            const amount = `${transaction?.amount || 0} TND`;
            
            if (!email || !email.includes('@')) {
                return false;
            }

            let itemName = '';
            let itemDescription = '';
            
            if (itemType === 'course') {
                itemName = itemData?.course?.name || transaction?.metadata?.courseName || 'Cours';
                itemDescription = 'Votre cours a été ajouté à votre compte.';
            } else if (itemType === 'pack') {
                itemName = itemData?.subscription?.packName || transaction?.metadata?.subscriptionName || 'Abonnement';
                itemDescription = 'Votre abonnement a été activé.';
            }

            const emailData = {
                to: email,
                subject: itemType === 'course' 
                    ? 'Confirmation d\'achat de cours - TEC2HUB'
                    : 'Confirmation d\'abonnement - TEC2HUB',
                template: 'payment-confirmation',
                data: {
                    customer: {
                        firstName,
                        lastName,
                        email
                    },
                    payment: {
                        amount,
                        transactionId: transaction?.id || 'N/A',
                        paymeeTransactionId: token,
                        paymentMethod: 'paymee',
                        date: new Date().toLocaleDateString('fr-FR')
                    },
                    order: {
                        id: transaction?.orderId || transaction?.id || 'N/A',
                        note: transaction?.note || '',
                        itemName,
                        itemDescription
                    },
                    itemType,
                    supportEmail: 'dev.tec2hub@gmail.com',
                    websiteUrl: 'https://tec2hub.com'
                }
            };

            const result = await emailService.sendEmail(emailData);
            
            if (result.success) {
                setEmailSent(true);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    const processPaymentConfirmation = async () => {
        setProcessing(true);
        setStatus('processing');
        
        try {
            const token = getPaymentTokenFromURL();
            setPaymentToken(token);
            
            const transactionId = getTransactionId();
            if (!transactionId) {
                setStatus('error');
                return;
            }
            
            let transaction = await fetchTransactionDirect(transactionId);
            
            if (!transaction) {
                const result = await PaymentService.getTransaction(transactionId);
                if (result.success && result.data) {
                    transaction = result.data;
                }
            }
            
            if (!transaction) {
                setStatus('error');
                return;
            }
            
            setTransactionData(transaction);
            
            const determinedItemType = determineItemType(transaction);
            setItemType(determinedItemType);
            
            const sessionData = getItemDataFromSession();
            setItemData(sessionData);
            
            // Update transaction status
            if (token) {
                await updateTransactionStatus(transactionId, token);
            }
            
            // WAIT FOR USER OBJECT IF AUTHENTICATED
            if (isAuthenticated && (!user || !(user.id || user.uid))) {
                // Wait for user object with retries
                let retries = 0;
                const maxRetries = 10;
                while (retries < maxRetries && (!user || !(user.id || user.uid))) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    retries++;
                }
            }
            
            // For course purchases, do enrollment immediately
            if (determinedItemType === 'course') {
                const courseId = getCourseIdFromMultipleSources(transaction, sessionData);
                
                if (courseId) {
                    const courseEnrolled = await enrollUserInCourse(courseId);
                    
                    if (courseEnrolled) {
                        // Success
                    } else {
                        setStatus('partial');
                    }
                } else {
                    setStatus('partial');
                }
            } else if (determinedItemType === 'pack') {
                const subscriptionId = 
                    transaction?.metadata?.subscriptionId || 
                    sessionData?.subscription?.id ||
                    sessionData?.subscriptionId;
                
                if (subscriptionId) {
                    const packEnrolled = await enrollUserInPack(subscriptionId);
                    
                    if (!packEnrolled) {
                        setStatus('partial');
                    }
                } else {
                    setStatus('partial');
                }
            }
            
            // Send confirmation email
            if (transaction) {
                const emailSuccess = await sendConfirmationEmail(transaction, token, determinedItemType, sessionData);
                
                if (emailSuccess && status !== 'partial' && status !== 'error') {
                    setStatus('success');
                } else if (status !== 'partial' && status !== 'error') {
                    setStatus('partial');
                }
            } else if (status !== 'partial' && status !== 'error') {
                setStatus('partial');
            }
            
        } catch (error) {
            setStatus('error');
        } finally {
            setProcessing(false);
        }
    };

    // Run processPaymentConfirmation when auth is ready AND user object is available
    useEffect(() => {
        if (authChecked) {
            // If authenticated, wait for user object to be ready
            if (isAuthenticated) {
                if (userReady || (user && (user.id || user.uid || user.email))) {
                    processPaymentConfirmation();
                } else {
                    const timeout = setTimeout(() => {
                        processPaymentConfirmation();
                    }, 1000);
                    
                    return () => clearTimeout(timeout);
                }
            } else {
                processPaymentConfirmation();
            }
        }
    }, [authChecked, userReady, isAuthenticated, user]);

    const cleanupSessionStorage = () => {
        const keys = [
            'currentTransactionId',
            'paymeeOrderId', 
            'paymeePaymentToken',
            'paymentSessionData',
            'courseTransactionId',
            'coursePaymeeOrderId',
            'coursePaymeePaymentToken',
            'coursePaymentSessionData',
            'packTransactionId',
            'packPaymeeOrderId',
            'packPaymeePaymentToken',
            'packPaymentSessionData',
            'selectedCourseId',
            'pendingCourseEnrollment'
        ];
        
        keys.forEach(key => sessionStorage.removeItem(key));
    };

    const handleNavigate = (path) => {
        cleanupSessionStorage();
        navigate(path);
    };

    const getSuccessTitle = () => {
        if (itemType === 'course') return 'Achat de cours confirmé !';
        if (itemType === 'pack') return 'Abonnement activé !';
        return 'Paiement confirmé !';
    };

    const getSuccessMessage = () => {
        if (itemType === 'course') {
            if (enrollmentStatus.success) {
                return `Félicitations ! Votre cours a été ajouté au compte de ${
                    foundUserByEmail ? foundUserByEmail.email : 'votre compte'
                }.`;
            } else if (enrollmentStatus.attempted && !enrollmentStatus.success) {
                return 'Paiement réussi. Nous rencontrons des difficultés techniques pour ajouter le cours.';
            } else if (foundUserByEmail && !isAuthenticated) {
                return `Paiement réussi ! Le cours a été ajouté au compte associé à ${foundUserByEmail.email}.`;
            } else {
                return 'Paiement réussi. Le cours sera ajouté à votre compte une fois connecté.';
            }
        } else if (itemType === 'pack') {
            return 'Félicitations ! Votre abonnement a été activé avec succès.';
        }
        return 'Votre paiement a été traité avec succès.';
    };

    const getItemIcon = () => {
        if (itemType === 'course') return <Book className="h-12 w-12 text-green-600" />;
        if (itemType === 'pack') return <Package className="h-12 w-12 text-blue-600" />;
        return <CheckCircle className="h-12 w-12 text-green-600" />;
    };

    const getItemName = () => {
        if (itemType === 'course') {
            return transactionData?.metadata?.courseName || 
                   itemData?.course?.name || 
                   'Votre cours';
        } else if (itemType === 'pack') {
            return transactionData?.metadata?.subscriptionName || 
                   itemData?.subscription?.packName || 
                   'Votre abonnement';
        }
        return transactionData?.note || 'Votre achat';
    };

    // Show loading while auth is being checked
    if (authLoading || !authChecked) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Vérification en cours...
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Nous vérifions votre transaction.
                    </p>
                </div>
            </div>
        );
    }

    if (processing) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Confirmation en cours...
                    </h1>
                    <p className="text-gray-600 mb-4">
                        {itemType === 'course' 
                            ? 'Nous ajoutons votre cours à votre compte.'
                            : itemType === 'pack'
                            ? 'Nous activons votre abonnement.'
                            : 'Nous finalisons votre paiement.'}
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-100 rounded-full p-4">
                            <AlertCircle className="h-12 w-12 text-red-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Problème technique
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Nous avons rencontré une difficulté technique.
                        Votre paiement a peut-être été traité avec succès.
                    </p>
                    
                    <div className="flex flex-col gap-3 justify-center">
                        {!isAuthenticated && (
                            <Button
                                onClick={() => navigate('/login?returnTo=/payment-confirmation')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Se connecter pour activer le cours
                            </Button>
                        )}
                        <div className="flex gap-3">
                            <Button
                                onClick={() => handleNavigate("/support")}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Contacter le support
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleNavigate("/")}
                            >
                                Retour à l'accueil
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            {getItemIcon()}
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        {status === 'partial' ? 'Paiement traité' : getSuccessTitle()}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {status === 'partial' 
                            ? 'Votre paiement a été traité avec succès.'
                            : getSuccessMessage()}
                    </p>
                    
                    {/* User Information */}
                    {(foundUserByEmail || enrollmentStatus.userId) && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                <h4 className="font-semibold text-blue-900">Compte associé</h4>
                            </div>
                            <div className="text-sm text-gray-700">
                                <p><span className="font-medium">Email:</span> {foundUserByEmail?.email || transactionData?.customer?.email}</p>
                                <p><span className="font-medium">ID Utilisateur:</span> {enrollmentStatus.userId || foundUserByEmail?.id}</p>
                                <p><span className="font-medium">Statut:</span> {
                                    isAuthenticated ? 'Connecté ✓' :
                                    foundUserByEmail ? 'Trouvé par email' : 'Non connecté'
                                }</p>
                                {enrollmentStatus.method && (
                                    <p><span className="font-medium">Méthode:</span> {
                                        enrollmentStatus.method === 'authenticated_user' ? 'Utilisateur authentifié' :
                                        enrollmentStatus.method.includes('found') ? 'Trouvé par email' :
                                        enrollmentStatus.method
                                    }</p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                        <h4 className="font-semibold text-blue-900 mb-2 text-center">
                            Résumé de la transaction
                        </h4>
                        <div className="space-y-1 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span className="font-medium">Article:</span>
                                <span className="font-semibold">{getItemName()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Paiement:</span>
                                <span className="font-semibold text-green-600">Réussi</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Via:</span>
                                <span>Paymee</span>
                            </div>
                            {transactionData?.customer?.email && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Email:</span>
                                    <span>{transactionData.customer.email}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="font-medium">Confirmation:</span>
                                <span className={emailSent ? 'text-green-600' : 'text-yellow-600'}>
                                    {emailSent ? 'Envoyée' : 'Traitée'}
                                </span>
                            </div>
                            {itemType === 'course' && (
                                <div className="flex justify-between">
                                    <span className="font-medium">Statut du cours:</span>
                                    <span className={
                                        enrollmentStatus.success ? 'text-green-600 font-semibold' :
                                        enrollmentStatus.attempted && !enrollmentStatus.success ? 'text-red-600' :
                                        foundUserByEmail ? 'text-green-600' :
                                        isAuthenticated ? 'text-yellow-600' : 'text-gray-500'
                                    }>
                                        {enrollmentStatus.success ? 'Ajouté ✓' :
                                         enrollmentStatus.attempted && !enrollmentStatus.success ? 'Erreur' :
                                         foundUserByEmail ? 'Ajouté au compte associé' :
                                         isAuthenticated ? 'En cours...' : 'Connectez-vous'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {status === 'partial' && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 inline-block">
                            <p className="text-yellow-800 text-sm font-medium">
                                Note : Certains services peuvent mettre quelques minutes à s'activer
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {itemType === 'course' ? 'Votre cours est prêt !' : 
                                 itemType === 'pack' ? 'Votre abonnement est actif !' : 
                                 'Votre accès est activé !'}
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MailCheck className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">
                                            {emailSent ? 'Email envoyé' : 'Confirmation traitée'}
                                        </h4>
                                        <p className="text-gray-600 text-xs">
                                            {emailSent 
                                                ? 'Vérifiez votre boîte mail pour les détails.'
                                                : 'Votre accès a été activé avec succès.'}
                                        </p>
                                    </div>
                                </div>

                                {itemType === 'course' && (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <Video className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">
                                                    Accès aux vidéos
                                                </h4>
                                                <p className="text-gray-600 text-xs">
                                                    Toutes les leçons vidéo sont maintenant disponibles.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Download className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">
                                                    Ressources téléchargeables
                                                </h4>
                                                <p className="text-gray-600 text-xs">
                                                    Téléchargez les supports de cours et exercices.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {itemType === 'pack' && (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <Book className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">
                                                    Accès illimité
                                                </h4>
                                                <p className="text-gray-600 text-xs">
                                                    Tous les cours du pack sont maintenant disponibles.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Globe className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-sm">
                                                    {transactionData?.metadata?.billingPeriod === 'yearly' ? 'Accès annuel' : 'Accès mensuel'}
                                                </h4>
                                                <p className="text-gray-600 text-xs">
                                                    {transactionData?.metadata?.billingPeriod === 'yearly' 
                                                        ? 'Votre abonnement est valable 1 an.'
                                                        : 'Votre abonnement est renouvelé mensuellement.'}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex items-start gap-3">
                                    <Award className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">
                                            {itemType === 'course' ? 'Certificat' : 'Certificats'}
                                        </h4>
                                        <p className="text-gray-600 text-xs">
                                            {itemType === 'course'
                                                ? 'Obtenez un certificat à la fin du cours.'
                                                : 'Obtenez des certificats pour chaque cours terminé.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-6">
                                <Button 
                                    onClick={() => {
                                        if (itemType === 'course') {
                                            if (isAuthenticated && enrollmentStatus.success) {
                                                handleNavigate("/dashboard/etudiant/profile");
                                            } else if (foundUserByEmail && enrollmentStatus.success) {
                                                navigate(`/login?email=${encodeURIComponent(foundUserByEmail.email)}&returnTo=/dashboard/etudiant/profile`);
                                            } else if (!isAuthenticated) {
                                                navigate('/login?returnTo=/payment-confirmation');
                                            }
                                        } else if (itemType === 'pack') {
                                            handleNavigate("/courses");
                                        } else {
                                            handleNavigate("/dashboard/etudiant/profile");
                                        }
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-base font-semibold"
                                    disabled={itemType === 'course' && isAuthenticated && !enrollmentStatus.success && status === 'partial'}
                                >
                                    {itemType === 'course' 
                                        ? (!isAuthenticated && foundUserByEmail ? 'Se connecter pour accéder' :
                                           !isAuthenticated ? 'Se connecter pour accéder' :
                                           enrollmentStatus.success ? 'Accéder au cours' : 
                                           'Préparation en cours...')
                                        : itemType === 'pack' 
                                        ? 'Explorer les cours' 
                                        : 'Tableau de bord'}
                                </Button>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleNavigate("/dashboard/etudiant/profile")}
                                        className="flex-1 rounded-lg border-gray-300"
                                    >
                                        Tableau de bord
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleNavigate("/")}
                                        className="flex-1 rounded-lg border-gray-300"
                                    >
                                        Accueil
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Démarrage rapide
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                        <h4 className="font-semibold text-gray-900 text-sm">
                                            {itemType === 'course' ? 'Continuer le cours' : 'Cours recommandés'}
                                        </h4>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-lg text-xs"
                                        onClick={() => {
                                            if (itemType === 'course' && !isAuthenticated) {
                                                if (foundUserByEmail) {
                                                    navigate(`/login?email=${encodeURIComponent(foundUserByEmail.email)}&returnTo=/dashboard/etudiant/progression`);
                                                } else {
                                                    navigate('/login?returnTo=/payment-confirmation');
                                                }
                                            } else {
                                                handleNavigate(
                                                    itemType === 'course' 
                                                        ? "/dashboard/etudiant/progression"
                                                        : "/courses"
                                                );
                                            }
                                        }}
                                        disabled={itemType === 'course' && isAuthenticated && !enrollmentStatus.success && status === 'partial'}
                                    >
                                        {itemType === 'course' && !isAuthenticated ? 'Se connecter' : 'Voir'}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-green-500" />
                                        <h4 className="font-semibold text-gray-900 text-sm">
                                            Suivi de progression
                                        </h4>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-lg text-xs"
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                if (foundUserByEmail) {
                                                    navigate(`/login?email=${encodeURIComponent(foundUserByEmail.email)}&returnTo=/dashboard/etudiant/progression`);
                                                } else {
                                                    navigate('/login?returnTo=/payment-confirmation');
                                                }
                                            } else {
                                                handleNavigate("/dashboard/etudiant/profile");
                                            }
                                        }}
                                        disabled={itemType === 'course' && isAuthenticated && !enrollmentStatus.success && status === 'partial'}
                                    >
                                        {!isAuthenticated ? 'Se connecter' : 'Voir'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
                            <h2 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                                <Gift className="h-5 w-5" />
                                {itemType === 'pack' ? 'Avantages Premium' : 'Bonus inclus'}
                            </h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-purple-600" />
                                    <span className="text-gray-700 text-sm">
                                        Support prioritaire
                                    </span>
                                </div>
                                {itemType === 'pack' && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-purple-600" />
                                        <span className="text-gray-700 text-sm">
                                            Tous les cours inclus
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-purple-600" />
                                    <span className="text-gray-700 text-sm">
                                        Accès au groupe VIP Discord
                                    </span>
                                </div>
                            </div>
                            <div className="text-center">
                                <Button 
                                    onClick={() => handleNavigate("/bonus")}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg text-sm"
                                >
                                    Découvrir les avantages
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Debug Info Section - Only in development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-900">Debug Information</h4>
                            <Button 
                                onClick={testDirectEnrollment}
                                className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3"
                            >
                                Test Direct Enrollment
                            </Button>
                        </div>
                    </div>
                )}

                <div className="text-center mt-10 border-t border-gray-200 pt-8">
                    <p className="text-gray-600 text-sm mb-4">
                        Des questions ? Notre équipe support est là pour vous aider.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg text-xs"
                            onClick={() => handleNavigate("/about")}
                        >
                            Centre d'aide
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg text-xs"
                            onClick={() => handleNavigate("/about")}
                        >
                            Contacter le support
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmedPayment;