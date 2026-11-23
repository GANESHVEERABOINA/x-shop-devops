import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const ROLES = [
  { name: 'Manager', desc: 'Full access to overview, inventory, and order fulfillment' },
  { name: 'Inventory Manager', desc: 'Can add, edit prices/sizes, mark sold out, and remove products' },
  { name: 'Order Manager', desc: 'Can view and update customer order delivery statuses' },
  { name: 'Viewer', desc: 'Read-only access to dashboard stats and catalog' },
];

const Team = ({ token, adminProfile }) => {
  const [admins, setAdmins] = useState([])
  const [currentAdmin, setCurrentAdmin] = useState(adminProfile || null)
  const [loading, setLoading] = useState(true)

  // Add New Admin Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Manager')
  const [submitting, setSubmitting] = useState(false)

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/admin/list', { headers: { token } })
      if (response.data.success) {
        setAdmins(response.data.admins)
        if (response.data.currentAdmin) {
          setCurrentAdmin(response.data.currentAdmin)
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchAdmins()
  }, [token])

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await axios.post(
        backendUrl + '/api/admin/add',
        { name, email, password, role },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setEmail('')
        setPassword('')
        setRole('Manager')
        fetchAdmins()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/admin/update-role',
        { id, role: newRole },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        fetchAdmins()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRemoveAdmin = async (id, adminName) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/admin/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(`${adminName} removed from admin team`)
        fetchAdmins()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const isPrimary = Boolean(currentAdmin?.isPrimary)

  return (
    <div className='text-zinc-100 w-full space-y-6'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold tracking-tight text-white'>Admin Profile & Team</h2>
        <p className='text-xs sm:text-sm text-zinc-400 mt-1'>
          Manage administrator accounts, roles, and access control
        </p>
      </div>

      {/* Logged-in Admin Profile Card */}
      <div className='glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='w-14 h-14 rounded-2xl btn-violet flex items-center justify-center text-xl font-bold uppercase shrink-0'>
            {currentAdmin?.name ? currentAdmin.name[0] : 'A'}
          </div>
          <div className='space-y-1'>
            <div className='flex items-center gap-2.5 flex-wrap'>
              <h3 className='text-base sm:text-lg font-bold text-white'>
                {currentAdmin?.name || 'Admin'}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                isPrimary
                  ? 'bg-violet-500/20 text-violet-300 border-violet-400/35'
                  : 'bg-white/[0.06] text-zinc-300 border-white/15'
              }`}>
                {currentAdmin?.role || 'Admin'}
              </span>
            </div>
            <p className='text-xs text-zinc-400'>{currentAdmin?.email}</p>
          </div>
        </div>

        <div className='glass-pill px-4 py-2.5 rounded-xl text-xs text-zinc-300 space-y-0.5'>
          <p className='text-[10px] uppercase tracking-wider text-zinc-500 font-semibold'>Access Level</p>
          <p className='font-semibold text-white'>
            {isPrimary ? 'Full Root Control (Can Add/Remove Admins)' : 'Assigned Team Role'}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
        {/* Left: Active Admins List */}
        <div className={`${isPrimary ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-semibold text-white'>Authorized Administrators</h4>
            <span className='glass-pill px-3 py-1 rounded-full text-xs text-zinc-400 tabular-nums'>
              {admins.length} member{admins.length > 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className='glass-card rounded-2xl p-8 text-center text-xs text-zinc-500'>
              Loading team members...
            </div>
          ) : (
            <div className='space-y-2.5'>
              {admins.map((member) => (
                <div
                  key={member._id}
                  className='glass-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4'
                >
                  <div className='flex items-center gap-3.5 min-w-0'>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold uppercase shrink-0 ${
                      member.isPrimary
                        ? 'btn-violet'
                        : 'bg-white/[0.06] border border-white/10 text-zinc-200'
                    }`}>
                      {member.name?.[0] || 'A'}
                    </div>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-semibold text-white truncate'>{member.name}</p>
                        {member.isPrimary && (
                          <span className='px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-400/30'>
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-zinc-400 truncate'>{member.email}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-2.5 justify-end'>
                    {member.isPrimary ? (
                      <span className='glass-pill px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-300'>
                        Primary Admin
                      </span>
                    ) : isPrimary ? (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member._id, e.target.value)}
                          className='glass-input text-xs font-medium rounded-xl px-3 py-1.5 cursor-pointer'
                        >
                          {ROLES.map((r) => (
                            <option key={r.name} value={r.name}>{r.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveAdmin(member._id, member.name)}
                          className='bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-medium px-3 py-1.5 rounded-xl transition cursor-pointer'
                        >
                          Revoke
                        </button>
                      </>
                    ) : (
                      <span className='glass-pill px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300'>
                        {member.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Add New Admin Form (Primary Admin Only) */}
        {isPrimary && (
          <form onSubmit={handleAddAdmin} className='lg:col-span-5 glass-card rounded-2xl p-6 space-y-4'>
            <div>
              <h4 className='text-sm font-semibold text-white'>Add New Admin</h4>
              <p className='text-xs text-zinc-500 mt-0.5'>
                Grant dashboard access and assign a specific role
              </p>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-400 block'>Full Name</label>
              <input
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g. Rahul Sharma'
                className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-zinc-600'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-400 block'>Email Address</label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='rahul@xshop.com'
                className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-zinc-600'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-400 block'>Temporary Password</label>
              <input
                type='password'
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Min. 6 characters'
                className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm placeholder:text-zinc-600'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-zinc-400 block'>Assign Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='w-full glass-input rounded-xl px-3.5 py-2.5 text-sm cursor-pointer'
              >
                {ROLES.map((r) => (
                  <option key={r.name} value={r.name}>{r.name}</option>
                ))}
              </select>
              <p className='text-[11px] text-zinc-500 pt-0.5'>
                {ROLES.find((r) => r.name === role)?.desc}
              </p>
            </div>

            <button
              type='submit'
              disabled={submitting}
              className='w-full py-2.5 px-4 rounded-xl btn-primary font-semibold text-sm cursor-pointer mt-2 disabled:opacity-50'
            >
              {submitting ? 'Adding Admin...' : 'Add Admin Member'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Team