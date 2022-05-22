import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import Spinner from 'react-bootstrap/Spinner';

export default function WelcomeDashboardTab(props) {
    let results = ''
    let results_property = false
    const { data: bookings, isLoading, error } = useQuery('bookings', async () => {
        const response = await api.get('/bookings', {
            params: {
                user_id: props.user.id
            }
        })
        const data = await response.data
        return data
    })
 if (!isLoading) { 
    results = bookings.results_booker.length === 0 ? bookings.results_property : bookings.results_booker
    results_property = bookings.results_booker.length === 0 
}
    return (
        <div className="tab-pane fade active show" id="ltn_tab_1_1">
            <div className="ltn__myaccount-tab-content-inner">
                <p>Olá <strong>{props.user.name}</strong></p>
                <div>
                    <table className="table">
                        {!isLoading &&  <thead>
                            <tr>
                                <th scope="col text-center">Minhas visitas</th>
                                {results_property && <th className='text-center' scope="col text-center">Quem agendou</th>}
                                <th className='text-center' scope="col text-center">Valor</th>
                                <th className='text-center' scope="col text-center">data</th>
                                <th className='text-center' scope="col text-center">horário</th>
                                <th className='text-center' scope="col">status</th>
                                <th className='text-center' scope="col">Ações </th>
                            </tr>
                        </thead>}
                        <tbody>
                            {
                                isLoading?
                                <div>
                                    <Spinner animation="border" role="status" >
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
					            </div>
                               
                                : error ?
                                    <div>
                                        erro, {error.message}
                                    </div>
                                :
                                results.map(item => (
                                    <tr key={item.id}>
                                        <td className="ltn__my-properties-img go-top">
                                            <Link to={`/imovel/${item.property_id} `} ><img src={item.ad_image} alt="Imagem de imóvel" /></Link>
                                        </td>
                                        {results_property && <td  className='text-center'>{item.user_booked}</td>}
                                        <td>
                                        {item.ad_value}
                                        </td>
                                        <td className='text-center'>
                                        { (item.date_booking instanceof Date) ? item.created.toLocaleDateString() : new Date(item.date_booking).toLocaleDateString('pt-br') }
                                        </td>
                                        <td className='text-center'>{item.time_booking}</td>
                                        <td className='text-center'>{item.status}</td>
                                        <td>
                                            <div className='d-flex flex-column align-items-center justify-content-space-around'>
                                                <Link to="#" title=""><i  className="fa-solid fa-trash-can" /></Link>
                                                {item.booker_user_id !== props.user.id && <Link to="#" title="confirmar"><i className="fa-solid fa-circle-check" /></Link>}
                                                <Link to="#" title="cancelar"><i className="fa-solid fa-ban" /></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }


                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}