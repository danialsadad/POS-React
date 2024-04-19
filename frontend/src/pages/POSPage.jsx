import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import axios from "axios";
import { toast } from 'react-toastify';
import { ComponentToPrint } from '../components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';

function POSPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const toastOptions = {
        autoClose: 400,
        pauseOnHover: true,
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        const result = await axios.get('http://localhost:5000/products');
        setProducts(await result.data);
        setIsLoading(false);
    }

    const addProductToCart = async (product) => {
        let findProductInCart = cart.find(item => item.id === product.id);

        if (findProductInCart) {
            const newCart = cart.map(item => {
                if (item.id === product.id) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                        totalAmount: item.price * (item.quantity + 1)
                    };
                }
                return item;
            });
            setCart(newCart);
            toast(`Added ${product.name} to cart`, toastOptions);
        } else {
            setCart([...cart, { ...product, quantity: 1, totalAmount: product.price }]);
            toast(`Added ${product.name} to cart`, toastOptions);
        }
    }

    const removeProductFromCart = (product) => {
        const newCart = cart.filter(item => item.id !== product.id);
        setCart(newCart);
        toast(`Removed ${product.name} from cart`, toastOptions);
    }

    const componentRef = useRef();

    const handleReactToPrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handlePrint = () => {
        handleReactToPrint();
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let newTotalAmount = 0;
        cart.forEach(item => {
            newTotalAmount += parseInt(item.totalAmount);
        });
        setTotalAmount(newTotalAmount);
    }, [cart])

    return (
        <MainLayout>
            <div className='row'>
                <div className='col-lg-8'>
                    {isLoading ? 'Loading' : (
                        <div className='row'>
                            {products.map((product, index) => (
                                <div key={index} className='col-lg-4 mb-4'>
                                    <div className='pos-item px-3 text-center border'>
                                        <p>{product.name}</p>
                                        <img src={product.image} className="img-fluid" alt={product.name} />
                                        <p>${product.price}</p>
                                        <button className='btn btn-primary btn-sm' onClick={() => addProductToCart(product)}>Add to Cart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className='col-lg-4'>
                    <div style={{ display: "none" }}>
                        <ComponentToPrint cart={cart} totalAmount={totalAmount} ref={componentRef} />
                    </div>
                    <div className='table-responsive bg-dark'>
                        <table className='table table-responsive table-dark table-hover'>
                            <thead>
                                <tr>
                                    <td>#</td>
                                    <td>Name</td>
                                    <td>Price</td>
                                    <td>Qty</td>
                                    <td>Total</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>${item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.totalAmount}</td>
                                        <td>
                                            <button className='btn btn-danger btn-sm' onClick={() => removeProductFromCart(item)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h2 className='px-2 text-white'>Total Amount: ${totalAmount}</h2>
                    </div>
                    <div className='mt-3'>
                        {totalAmount !== 0 ? (
                            <div>
                                <button className='btn btn-primary' onClick={handlePrint}>Pay Now</button>
                            </div>
                        ) : 'Please add a product to the cart'}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default POSPage;
