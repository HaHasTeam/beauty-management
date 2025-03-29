type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
  GoogleIcon: (props: IconProps) => {
    return (
      <svg
        {...props}
        className='h-6 w-6 mr-2'
        xmlns='http://www.w3.org/2000/svg'
        width='800px'
        height='800px'
        viewBox='-0.5 0 48 48'
        version='1.1'
      >
        <title>Google-color</title> <desc>Created with Sketch.</desc>
        <defs> </defs>
        <g id='Icons' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
          <g id='Color-' transform='translate(-401.000000, -860.000000)'>
            <g id='Google' transform='translate(401.000000, 860.000000)'>
              <path
                d='M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24'
                id='Fill-1'
                fill='#FBBC05'
              ></path>
              <path
                d='M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333'
                id='Fill-2'
                fill='#EB4335'
              ></path>
              <path
                d='M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667'
                id='Fill-3'
                fill='#34A853'
              ></path>
              <path
                d='M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24'
                id='Fill-4'
                fill='#4285F4'
              ></path>
            </g>
          </g>
        </g>
      </svg>
    )
  },
  spinner: (props: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  ),
  facebook: (props: IconProps) => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z'
        stroke='black'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ),
  instagram: (props: IconProps) => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z'
        stroke='black'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M15.9997 11.3703C16.1231 12.2025 15.981 13.0525 15.5935 13.7993C15.206 14.5461 14.5929 15.1517 13.8413 15.53C13.0898 15.9082 12.2382 16.0399 11.4075 15.9062C10.5768 15.7726 9.80947 15.3804 9.21455 14.7855C8.61962 14.1905 8.22744 13.4232 8.09377 12.5925C7.96011 11.7619 8.09177 10.9102 8.47003 10.1587C8.84829 9.40716 9.45389 8.79404 10.2007 8.40654C10.9475 8.01904 11.7975 7.87689 12.6297 8.0003C13.4786 8.12619 14.2646 8.52176 14.8714 9.12861C15.4782 9.73545 15.8738 10.5214 15.9997 11.3703Z'
        stroke='black'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M17.5 6.5H17.51' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ),
  youtube: (props: IconProps) => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M12 19C9.7 19 5.6 18.8 3.9 18.4C3.2 18.2 2.7 17.7 2.5 17C2.2 15.9 2 13.6 2 12C2 10.4 2.2 8.1 2.5 7C2.7 6.3 3.2 5.8 3.9 5.6C5.6 5.2 9.7 5 12 5C14.3 5 18.4 5.2 20.1 5.6C20.8 5.8 21.3 6.3 21.5 7C21.8 8.1 22 10.4 22 12C22 13.6 21.8 15.9 21.5 17C21.3 17.7 20.8 18.2 20.1 18.4C18.4 18.8 14.3 19 12 19Z'
        stroke='black'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path d='M10 15L15 12L10 9V15Z' stroke='black' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}
