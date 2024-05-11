import { Button, Card, Label, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../apiConfig';
import { signInFailure, signInStart, signInSuccess } from '../components/redux/user/userSlice';

const EmployeeLogin = () => {
  const [loadinga, setLoadinga] = useState(false);
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [message, setMessage] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${BASE_URL}/auth/workerlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }

      if (!res.ok) {
        setMessage(true);
      }

      const { user, accessToken } = data.data; // Check if accessToken is present in the correct structure
      dispatch(signInSuccess({ user, accessToken }));
      setMessage(false);
      navigate("/workerDashboard");
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };


    
  return (
    <div className='flex flex-col justify-center items-center py-32'>
        <Card className='w-[450px]'>
            <h1>Worker Login Page</h1>
            <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="employeeId" value="Employee Id" />
                </div>
                <TextInput
                  id="employeeId"
                  name="employeeId"
                  placeholder="1, 2, ..."
                  type="number"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Password" />
                </div>
                <TextInput
                  id="password"
                  name="password"
                  type="text"
                  placeholder="......"
                  onChange={handleChange}
                  required
                />
              </div>
              

              <div className="w-full">
                <Button className="text-lg font-sans" type="submit">
                  {loading ? "Loading..." : "Login"}
                </Button>
              </div>
              
            </div>
          </form>

        </Card>
    </div>
  )
}

export default EmployeeLogin
