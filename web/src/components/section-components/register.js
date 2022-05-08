import React, { useState }  from 'react';
import { Link,useHistory } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import moment  from 'moment';
import * as yup from 'yup'
import { toast } from 'react-toastify';
export default function Register() {
	const history = useHistory();
	const {handleLogin, user} = useAuth()
	const [valuesForm, setValuesForm] = useState({
		name:"",
		email:"",
		telephone:"",
		city:"",
		state:"",
		password:""
	})
	const [date, setDate] = useState('')
	async function handleRegister() {
		try {
			const schema = yup.object({
				name:yup.string().required('O campo nome é obrigatório e não pode está em branco'),
				email:yup.string().email("O email não é válido").required("O campo email é obrigatório e não pode está em branco"),
				password:yup.string().required('O campo senha é obrigatório e não pode está em branco')
			})
		await	schema.validate(valuesForm, {
				abortEarly:false
			})

			const response = await api.post("/users", {
				...valuesForm
				// birth_date: moment(date).format('YYYY-MM-DD')
			});
			if(response.status !== 500){
				const responseLogin = await api.post('/login', {
					email:response.data.email,
					password:response.data.password
				});
				await handleLogin(responseLogin.data);
				history.push('my-account')
			}
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				const errorMessages = {};
	
				error.inner.forEach((error) => {
					errorMessages[error.path] = error.message;
				});
				for (const key in errorMessages) {
					if (Object.hasOwnProperty.call(errorMessages, key)) {
						const element = errorMessages[key];
						toast(element, {
							hideProgressBar:true
						})
					}
				}
			}
		}
		
	}
	const handleChange = (e) => {
    const { name, value } = e.target
    setValuesForm({
      ...valuesForm,
      [name]: value,
    })
  }
	return (
		<div className="ltn__login-area pb-50"> 
				<div className="container">
				<div className="row">
					<div className="col-lg-12">
					<div className="section-title-area text-center">
						<h1 className="section-title">Cadastre <br />Sua Conta</h1>
						{/* <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. <br />
						Sit aliquid,  Non distinctio vel iste.</p> */}
					</div>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-6 offset-lg-3">
					<div className="account-login-inner">
						<form onSubmit={(e) => e.preventDefault()} className="ltn__form-box contact-form-box">
						<input type="text" name="name" placeholder="Nome" value={valuesForm.name}  onChange={handleChange}/>
						<input type="text" name="email" placeholder="Email*" value={valuesForm.email}  onChange={handleChange} />
						<input type="password" name="password" placeholder="Senha*" value={valuesForm.password}  onChange={handleChange}/>
						<input type="password" name="confirmpassword" placeholder="Confirme Senha*" />
						<label className="checkbox-inline">
							<input type="checkbox" defaultValue /> &nbsp;
							Ao Clicar você irá concordar com os Termos &amp; Condições
						</label>
						<div className="btn-wrapper">
							<button className="theme-btn-1 btn reverse-color btn-block" onClick={handleRegister}>CRIAR CONTA</button>
						</div>
						<div className="go-to-btn mt-50 go-top">
							<Link to="/login">Você ja tem uma conta?</Link>
						</div>
						</form>
					</div>
					</div>
				</div>
				</div>
			</div>
	)
}