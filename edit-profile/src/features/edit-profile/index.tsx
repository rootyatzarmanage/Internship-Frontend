import { useId, useState } from 'react'
import { ChevronDown, Pencil, Save, Trash2 } from 'lucide-react'
import { currentUser } from '../../mock/profileMock'

// Shared dark-mode class strings, so the same colours aren't repeated everywhere
const cardClass =
  'w-full rounded-md border border-gray-300 bg-[#FAFAFA] dark:border-[#303030] dark:bg-[#121212]'
const inputClass =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-sky-500 dark:border-[#303030] dark:bg-[#0F0F0F] dark:text-[#F5F5F5] dark:placeholder:text-[#6B6B6B] dark:focus:border-sky-500'
const selectClass =
  'w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 focus:outline-none focus:ring-0 focus:border-sky-500 dark:border-[#303030] dark:bg-[#151515] dark:text-[#F5F5F5]'
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-[#C4C4C4]'
const titleClass = 'text-[20px] font-semibold text-gray-900 dark:text-[#F5F5F5]'
const subtitleClass = 'mt-0.5 text-sm text-gray-500 dark:text-[#A3A3A3]'
const rowTitleClass = 'text-sm font-medium text-gray-900 dark:text-[#F5F5F5]'
const rowSubtitleClass = 'text-sm text-gray-500 dark:text-[#A3A3A3]'
const outlineButtonClass =
  'flex-shrink-0 self-start sm:self-auto rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-[#303030] dark:bg-[#151515] dark:text-[#C4C4C4] dark:hover:bg-[#222222]'

// ---------------------------------------------------------------------------
// Small reusable form pieces
// ---------------------------------------------------------------------------

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${inputClass}`}
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${selectClass} px-3 pr-9`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full border border-gray-300 bg-transparent p-0.5 transition-colors focus:outline-none dark:border-[#404040]"
    >
      <span
        className={`inline-block h-6 w-6 rounded-full transition-transform ${
          checked
            ? 'translate-x-6 bg-sky-500'
            : 'translate-x-0 bg-gray-500'
        }`}
      />
    </button>
  )
}

// ---------------------------------------------------------------------------
// UserDash — header card (yours, unchanged aside from fixing the mailto link)
// ---------------------------------------------------------------------------

function UserDash({
  user,
}: {
  user: typeof currentUser
}) {
  return (
    <div className={`${cardClass} px-[15px] py-[10px]`}>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:gap-[31px]">
        <div className="relative flex-shrink-0">
          <img
            src={user.avatar}
            className="h-[200px] w-[200px] rounded-xl border border-gray-200 object-cover sm:h-[160px] sm:w-[160px] dark:border-[#303030]"
          />

          <button
            type="button"
            className="absolute -bottom-2 -right-2 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-[#303030] dark:bg-[#151515] dark:text-[#C4C4C4] dark:hover:bg-[#222222]"
          >
            <span>Edit</span>
            <Pencil className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-7 text-center sm:text-left">
          <div>
            <h2 className="break-words text-xl font-bold tracking-tight text-[#404040] sm:text-2xl dark:text-[#F5F5F5]">
              {user.name}
            </h2>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-md font-medium text-[#737373] sm:justify-start">
            <span>{user.userId}</span>
            <span className="text-[#737373] xs:inline">|</span>
            <a
              href={`mailto:${user.email}`}
              className="max-w-full break-all transition-colors"
            >
              {user.email}
            </a>
          </div>

          <div className="mt-3 flex flex-col gap-1 text-sm font-regular text-[#404040] sm:flex-row sm:items-center sm:justify-between sm:gap-2 dark:text-[#E5E5E5]">
            <div>{user.number}</div>
            <div className="font-medium text-gray-600 dark:text-[#A3A3A3]">{user.location}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Profile — first name / last name / email / mobile
// ---------------------------------------------------------------------------

function ProfileForm({
  onSave,
}: {
  onSave: (updates: { name: string; email: string; number: string }) => void
}) {
  const [firstName, setFirstName] = useState(currentUser.name.split(' ')[0] ?? '')
  const [lastName, setLastName] = useState(currentUser.name.split(' ').slice(1).join(' ') ?? '')
  const [email, setEmail] = useState(currentUser.email)

  const numberParts = currentUser.number.split(' ')
  const [countryCode, setCountryCode] = useState(numberParts[0] ?? '+91')
  const [mobile, setMobile] = useState(numberParts.slice(1).join(' ') ?? '')

  const handleSave = () => {
    const name = `${firstName} ${lastName}`.trim()
    const number = `${countryCode} ${mobile}`.trim()

    onSave({ name, email, number })
    console.log('Saving profile', { firstName, lastName, email, countryCode, mobile })
  }

  return (
    <div className={`${cardClass} px-2 py-3 sm:p-5`}>
      <div>
        <h3 className={titleClass}>Profile</h3>
        <p className={subtitleClass}>Your Basic Account Information.</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="First Name" value={firstName} onChange={setFirstName} />
        <TextField label="Last Name" value={lastName} onChange={setLastName} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="E-mail Address" value={email} onChange={setEmail} type="email" />

        <div>
          <label className={labelClass}>Mobile Number</label>
          <div className="flex gap-2">
            <div className="relative w-20 sm:w-24 flex-shrink-0">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className={`${selectClass} px-2 pr-7 sm:px-3`}
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={`w-full min-w-0 flex-1 ${inputClass}`}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600 focus:outline-none focus:ring-0 focus:ring-offset-0"
        >
          <Save className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Address — country / state / district / pin code
// ---------------------------------------------------------------------------

function AddressForm({
  onSave,
}: {
  onSave: (updates: { location: string }) => void
}) {
  const locationParts = currentUser.location.split(',').map((p) => p.trim())
  const [state, setState] = useState(locationParts[0] ?? 'Tamil Nadu')
  const [country, setCountry] = useState(locationParts[1] ?? 'India')
  const [district, setDistrict] = useState('Coimbatore')
  const [pinCode, setPinCode] = useState('')

  const handleSave = () => {
    const location = pinCode.trim()
      ? `${district}, ${state}, ${country} - ${pinCode.trim()}`
      : `${district}, ${state}, ${country}`

    onSave({ location })
    console.log('Saving address', { country, state, district, pinCode })
  }

  return (
    <div className={`${cardClass} px-2 py-3 sm:p-5`}>
      <h3 className={titleClass}>Address</h3>
      <p className={subtitleClass}>This address appears on your invoices and account records.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField label="Country" value={country} onChange={setCountry} options={['India', 'United States', 'United Kingdom']} />
        <SelectField label="State" value={state} onChange={setState} options={['Tamil Nadu', 'Kerala', 'Karnataka']} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField label="District" value={district} onChange={setDistrict} options={['Coimbatore', 'Chennai', 'Madurai']} />
        <TextField label="Pin code" value={pinCode} onChange={setPinCode} placeholder="e.g. 641006" />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600 focus:outline-none focus:ring-0 focus:ring-offset-0"
        >
          <Save className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Security — change password / two-factor authentication
// ---------------------------------------------------------------------------

function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled)

  return (
    <div className={`${cardClass} px-2 py-3 sm:p-5`}>
      <h3 className={titleClass}>Security</h3>
      <p className={subtitleClass}>Manage how you sign in and keep your account secure.</p>

      <div className="mt-4 divide-y divide-gray-200 dark:divide-[#262626]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 first:pt-0 px-1">
          <div>
            <div className={rowTitleClass}>Change Password</div>
            <div className={rowSubtitleClass}>{`Last change ${new Date(currentUser.lastPasswordChange).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`}</div>
          </div>
          <button type="button" className={outlineButtonClass}>
            Change Password
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 last:pb-0 px-1">
          <div>
            <div className={rowTitleClass}>Two-Factor Authentication</div>
            <div className={rowSubtitleClass}>Add an extra layer of security at sign-in.</div>
          </div>
          <Toggle checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Danger Zone — logout everywhere / delete account
// ---------------------------------------------------------------------------

function DangerZone() {
  const handleLogoutAll = () => {
    // TODO: wire up to your logout-all-sessions API call
    console.log('Logging out from all devices')
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'This will permanently delete your account and all associated data. This cannot be undone. Continue?'
    )
    if (confirmed) {
      // TODO: wire up to your delete-account API call
      console.log('Deleting account')
    }
  }

  return (
    <div className={`${cardClass} px-2 py-3 sm:p-5`}>
      <h3 className={titleClass}>Danger Zone</h3>
      <p className={subtitleClass}>These actions are irreversible, proceed carefully.</p>

      <div className="mt-4 divide-y divide-gray-200 dark:divide-[#262626]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 first:pt-0 px-1">
          <div>
            <div className={rowTitleClass}>Logout from all device</div>
            <div className={rowSubtitleClass}>Sign out from every active session on all devices.</div>
          </div>
          <button type="button" onClick={handleLogoutAll} className={outlineButtonClass}>
            Logout all
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 last:pb-0 px-1">
          <div>
            <div className={rowTitleClass}>Delete Account</div>
            <div className={rowSubtitleClass}>Permanently delete your account and all associated data.</div>
          </div>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="inline-flex flex-shrink-0 self-start sm:self-auto items-center gap-1.5 rounded-md bg-rose-100 px-3.5 py-1.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-200 focus:outline-none focus:ring-0 focus:ring-offset-0 dark:bg-rose-950/40 dark:hover:bg-rose-950/70"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Profile() {
  const [user, setUser] = useState(currentUser)

  const handleProfileSave = (updates: {
    name: string
    email: string
    number: string
  }) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  const handleAddressSave = (updates: { location: string }) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-5 px-2 py-3 sm:p-6">
      <UserDash user={user} />
      <div className="flex w-full flex-col gap-4 sm:gap-5">
        <ProfileForm onSave={handleProfileSave} />
        <AddressForm onSave={handleAddressSave} />
        <SecuritySettings />
        <DangerZone />
      </div>
    </div>
  )
}